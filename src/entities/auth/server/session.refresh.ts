import 'server-only';

import {
  REFRESH_BUFFER_MS,
  REFRESH_MAX_COOLDOWN_MS,
  REFRESH_RATE_LIMITED_COOLDOWN_MS,
  REFRESH_TRANSIENT_COOLDOWN_MS,
} from '@/src/shared/api';
import { BackendError, backendFetch } from './backend';
import { getClientAddress } from './clientAddress';
import { deleteSessionCookie, getSession, writeSessionCookie } from './session.cookies';
import { mapResponseToSession, type AuthSession, type LoginResponse, type SessionState } from './session.types';

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
  | { status: 'unavailable'; retryAfterMs: number }; // transient failure -> keep the session, retry later

type RefreshEntry = {
  promise: Promise<RefreshResult>;
  /** Until this moment the outcome is reused; unbounded while the request is in flight. */
  expiresAt: number;
};

// Single-flight + grace cache keyed by the incoming refresh token. Concurrent
// callers share one in-flight request; late callers presenting the same old
// token reuse the resolved outcome. A transient failure is kept for its
// cooldown, so the shared refresh rate limit is not spent on retries.
const inflight = new Map<string, RefreshEntry>();

const cooldownAfter = (error: unknown): number => {
  if (error instanceof BackendError && error.status === 429) {
    const requested = error.retryAfterMs ?? REFRESH_RATE_LIMITED_COOLDOWN_MS;
    return Math.min(Math.max(requested, 1_000), REFRESH_MAX_COOLDOWN_MS);
  }
  return REFRESH_TRANSIENT_COOLDOWN_MS;
};

const computeRefresh = async (current: AuthSession): Promise<RefreshResult> => {
  try {
    const data = await backendFetch<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: current.refreshToken },
      clientIp: await getClientAddress(),
    });

    // The backend rotates the refresh token on every refresh; reuse the
    // previous one only if the response omits a fresh one.
    return { status: 'refreshed', session: mapResponseToSession(data, data.refresh_token ?? current.refreshToken) };
  } catch (error) {
    // A 401/400 means the refresh token is genuinely gone -> log out. Any other
    // error (rate limit, network, timeout, 5xx) is transient and must not drop the session.
    if (error instanceof BackendError && (error.status === 401 || error.status === 400)) {
      return { status: 'invalid' };
    }
    return { status: 'unavailable', retryAfterMs: cooldownAfter(error) };
  }
};

const dedupeRefresh = (current: AuthSession): Promise<RefreshResult> => {
  const key = current.refreshToken;
  const existing = inflight.get(key);
  if (existing && Date.now() < existing.expiresAt) {
    return existing.promise;
  }

  const entry: RefreshEntry = { expiresAt: Number.POSITIVE_INFINITY, promise: computeRefresh(current) };
  inflight.set(key, entry);

  void entry.promise.then((result) => {
    const ttl = result.status === 'unavailable' ? result.retryAfterMs : GRACE_TTL_MS;
    entry.expiresAt = Date.now() + ttl;
    setTimeout(() => {
      if (inflight.get(key) === entry) inflight.delete(key);
    }, ttl);
  });

  return entry.promise;
};

/**
 * Runs (or joins) a single-flight refresh for the given session, then applies
 * the outcome to *this* request's cookies. The cookie write happens per request
 * so every response re-affirms the rotated session, not just the one that
 * won the single-flight race.
 */
const applyRefresh = async (current: AuthSession): Promise<SessionState> => {
  const result = await dedupeRefresh(current);
  switch (result.status) {
    case 'refreshed':
      await writeSessionCookie(result.session);
      return { status: 'active', session: result.session };
    case 'invalid':
      await deleteSessionCookie();
      return { status: 'none' };
    case 'unavailable':
      return { status: 'unavailable', session: current, retryAfterMs: result.retryAfterMs };
  }
};

/**
 * Returns the current session, proactively refreshing it when the access token
 * is within {@link REFRESH_BUFFER_MS} of expiry. `none` means there is no session
 * or the refresh token is no longer valid; `unavailable` means the refresh failed
 * for a transient reason and the existing session must be kept.
 */
export const refreshSessionIfNeeded = async (): Promise<SessionState> => {
  const session = await getSession();
  if (!session) return { status: 'none' };

  const expiresAt = new Date(session.accessExpiresAt).getTime();
  const isStale = Date.now() >= expiresAt - REFRESH_BUFFER_MS;
  if (!isStale) return { status: 'active', session };

  return applyRefresh(session);
};

/**
 * Forces a refresh regardless of the access token's expiry, sharing the same
 * single-flight/grace cache. Used by the BFF to recover from an upstream 401
 * before falling back to logout.
 */
export const forceRefresh = async (): Promise<SessionState> => {
  const session = await getSession();
  if (!session) return { status: 'none' };
  return applyRefresh(session);
};
