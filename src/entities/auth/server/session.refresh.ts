import 'server-only';

import { REFRESH_BUFFER_MS, REFRESH_COOKIE_NAME } from '@/src/shared/api';
import { BackendError, backendFetchRaw, parseRefreshCookie } from './backend';
import { deleteSessionCookie, getSession, writeSessionCookie } from './session.cookies';
import { mapResponseToSession, type AuthSession, type LoginResponse } from './session.types';

/**
 * How long a completed refresh outcome is kept, keyed by the *incoming* refresh
 * token. The backend rotates the refresh token on every refresh and rejects the
 * old one with 401, so a request that was already on the wire with the previous
 * cookie (before the browser adopted the rotated one) would otherwise trigger a
 * second refresh and get logged out. Reusing the outcome within this window
 * closes that gap without hitting the backend again.
 */
const GRACE_TTL_MS = 60_000;

type RefreshResult =
  | { status: 'refreshed'; session: AuthSession }
  | { status: 'invalid' } // refresh token rejected by the backend -> log out
  | { status: 'error' }; // transient failure -> keep session, allow a retry

type RefreshEntry = {
  promise: Promise<RefreshResult>;
  at: number;
};

// Single-flight + grace cache keyed by the incoming refresh token. Concurrent
// callers share one in-flight request; late callers presenting the same old
// token reuse the resolved outcome for up to GRACE_TTL_MS.
const inflight = new Map<string, RefreshEntry>();

const computeRefresh = async (current: AuthSession): Promise<RefreshResult> => {
  try {
    const { data, setCookie } = await backendFetchRaw<LoginResponse>('/auth/refresh', {
      method: 'POST',
      cookie: `${REFRESH_COOKIE_NAME}=${current.refreshToken}`,
    });

    // The backend rotates the refresh token on every refresh; reuse the
    // previous one only if the response omits a fresh Set-Cookie.
    const rotated = parseRefreshCookie(setCookie);
    const session = mapResponseToSession(
      data,
      rotated?.token ?? current.refreshToken,
      rotated?.expiresAt ?? current.refreshExpiresAt
    );
    return { status: 'refreshed', session };
  } catch (error) {
    // A 401/400 means the refresh token is genuinely gone -> log out. Any other
    // error (network, timeout, 5xx) is transient and must not drop the session.
    if (error instanceof BackendError && (error.status === 401 || error.status === 400)) {
      return { status: 'invalid' };
    }
    return { status: 'error' };
  }
};

const scheduleCleanup = (key: string, entry: RefreshEntry): void => {
  void entry.promise.then((result) => {
    // Transient failures are not cached so the next request can retry.
    if (result.status === 'error') {
      if (inflight.get(key) === entry) inflight.delete(key);
      return;
    }
    // Successful and invalid outcomes are kept for the grace window so late
    // requests still carrying the old refresh token reuse the outcome.
    setTimeout(() => {
      if (inflight.get(key) === entry) inflight.delete(key);
    }, GRACE_TTL_MS);
  });
};

const dedupeRefresh = (current: AuthSession): Promise<RefreshResult> => {
  const key = current.refreshToken;
  const existing = inflight.get(key);
  if (existing && Date.now() - existing.at < GRACE_TTL_MS) {
    return existing.promise;
  }

  const entry: RefreshEntry = { at: Date.now(), promise: computeRefresh(current) };
  inflight.set(key, entry);
  scheduleCleanup(key, entry);
  return entry.promise;
};

/**
 * Runs (or joins) a single-flight refresh for the given session, then applies
 * the outcome to *this* request's cookies. The cookie write happens per request
 * so every response re-affirms the rotated Set-Cookie, not just the one that
 * won the single-flight race.
 */
const applyRefresh = async (current: AuthSession): Promise<AuthSession | null> => {
  const result = await dedupeRefresh(current);
  switch (result.status) {
    case 'refreshed':
      await writeSessionCookie(result.session);
      return result.session;
    case 'invalid':
      await deleteSessionCookie();
      return null;
    case 'error':
      return null;
  }
};

/**
 * Returns the current session, proactively refreshing it when the access token
 * is within {@link REFRESH_BUFFER_MS} of expiry. Returns `null` when there is no
 * session or the refresh token is no longer valid.
 */
export const refreshSessionIfNeeded = async (): Promise<AuthSession | null> => {
  const session = await getSession();
  if (!session) return null;

  const expiresAt = new Date(session.accessExpiresAt).getTime();
  const isStale = Date.now() >= expiresAt - REFRESH_BUFFER_MS;
  if (!isStale) return session;

  return applyRefresh(session);
};

/**
 * Forces a refresh regardless of the access token's expiry, sharing the same
 * single-flight/grace cache. Used by the BFF to recover from an upstream 401
 * before falling back to logout.
 */
export const forceRefresh = async (): Promise<AuthSession | null> => {
  const session = await getSession();
  if (!session) return null;
  return applyRefresh(session);
};
