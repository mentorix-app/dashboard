export type AuthSession = {
  accessToken: string;
  /** ISO timestamp when the access token expires (~15 min). */
  accessExpiresAt: string;
  refreshToken: string;
  /** ISO timestamp when the refresh token expires (~30 days). */
  refreshExpiresAt: string;
  userId: string;
  email: string;
};

/** Token response of sign-in and refresh (snake_case, as the backend sends it). */
export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_at: string;
  /** Present in every token response, in the cookie mode too. */
  refresh_expires_at: string;
  /** Present in the body mode used by the dashboard. */
  refresh_token?: string;
  user_id: string;
  email: string;
};

export const mapResponseToSession = (raw: LoginResponse, refreshToken: string): AuthSession => ({
  accessToken: raw.access_token,
  accessExpiresAt: raw.expires_at,
  refreshToken,
  refreshExpiresAt: raw.refresh_expires_at,
  userId: raw.user_id,
  email: raw.email,
});

/** `true` while the access token has not expired yet. */
export const isAccessTokenValid = (session: AuthSession, now: number = Date.now()): boolean =>
  new Date(session.accessExpiresAt).getTime() > now;

/**
 * Outcome of looking after the session for one request:
 * - `active`: the session is usable (fresh or just refreshed);
 * - `unavailable`: the refresh failed for a transient reason (rate limit, network,
 *   5xx); the session is intact and the next attempt is allowed after `retryAfterMs`;
 * - `none`: there is no session, or the backend rejected the refresh token.
 */
export type SessionState =
  | { status: 'active'; session: AuthSession }
  | { status: 'unavailable'; session: AuthSession; retryAfterMs: number }
  | { status: 'none' };
