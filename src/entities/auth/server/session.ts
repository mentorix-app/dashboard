import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { SignJWT, jwtVerify } from 'jose';

import { AUTH_SESSION_COOKIE, REFRESH_BUFFER_MS } from '@/src/shared/api';
import { backendFetch } from './backend';

/**
 * Session payload stored — encrypted — in the HttpOnly auth cookie.
 *
 * Contains the upstream backend bearer token plus minimal user identity
 * needed by the BFF and Server Components. Never exposed to the browser.
 */
export type AuthSession = {
  accessToken: string;
  /** ISO-8601 expiry timestamp from the backend. */
  expiresAt: string;
  userId: string;
  email: string;
};

/** Raw POST /auth/login and POST /auth/refresh response shape. */
type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_at: string;
  user_id: string;
  email: string;
};

const SECRET = process.env.SESSION_SECRET;
if (!SECRET) {
  throw new Error('SESSION_SECRET env var is required');
}
const KEY = new TextEncoder().encode(SECRET);
const ALG = 'HS256';

const mapResponseToSession = (raw: LoginResponse): AuthSession => ({
  accessToken: raw.access_token,
  expiresAt: raw.expires_at,
  userId: raw.user_id,
  email: raw.email,
});

const encryptSession = async (session: AuthSession): Promise<string> => {
  const expSeconds = Math.floor(new Date(session.expiresAt).getTime() / 1000);
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(KEY);
};

const decryptSession = async (token: string): Promise<AuthSession | null> => {
  try {
    const { payload } = await jwtVerify(token, KEY, { algorithms: [ALG] });
    if (
      typeof payload.accessToken === 'string' &&
      typeof payload.expiresAt === 'string' &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string'
    ) {
      return {
        accessToken: payload.accessToken,
        expiresAt: payload.expiresAt,
        userId: payload.userId,
        email: payload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Persist `session` as an HttpOnly + Secure + SameSite=Lax cookie that expires
 * with the backend access token.
 */
export const writeSessionCookie = async (session: AuthSession): Promise<void> => {
  const value = await encryptSession(session);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt),
  });
};

export const deleteSessionCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE);
};

/**
 * Read and decrypt the session cookie. Memoised per render via React `cache`
 * so callers can invoke it freely without extra cookie/JWT work.
 */
export const getSession = cache(async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!value) return null;
  return decryptSession(value);
});

/** Returns the session or redirects to `/login` when missing/expired. */
export const requireSession = async (): Promise<AuthSession> => {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
};

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

/** Single in-flight refresh promise to dedupe concurrent callers. */
let pendingRefresh: Promise<AuthSession | null> | null = null;

const performRefresh = async (current: AuthSession): Promise<AuthSession | null> => {
  try {
    const raw = await backendFetch<LoginResponse>('/auth/refresh', {
      method: 'POST',
      token: current.accessToken,
    });
    const next = mapResponseToSession(raw);
    await writeSessionCookie(next);
    return next;
  } catch {
    await deleteSessionCookie();
    return null;
  }
};

/**
 * Refreshes the session if the access token expires within `REFRESH_BUFFER_MS`.
 * Returns the (possibly refreshed) current session, or `null` if refresh failed
 * or no session exists.
 */
export const refreshSessionIfNeeded = async (): Promise<AuthSession | null> => {
  const session = await getSession();
  if (!session) return null;

  const expiresAt = new Date(session.expiresAt).getTime();
  const isStale = Date.now() >= expiresAt - REFRESH_BUFFER_MS;
  if (!isStale) return session;

  if (!pendingRefresh) {
    pendingRefresh = performRefresh(session).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
};

export { mapResponseToSession };
export type { LoginResponse };
