export const MENTORIX_API_BASE_URL = process.env.NEXT_PUBLIC_MENTORIX_API_URL || '';

/** Local backend-for-frontend mount point. Browser-side axios targets this. */
export const BFF_BASE_URL = '/api/bff';

export const TIMEOUT_MS = 15_000;

export const QUERY_KEY_AUTH = 'auth' as const;
export const QUERY_KEY_EXERCISES = 'exercises' as const;
export const QUERY_KEY_PROGRAMS = 'programs' as const;
export const QUERY_KEY_CLIENTS = 'clients' as const;
export const QUERY_KEY_ANALYTICS = 'analytics' as const;
export const QUERY_KEY_USER = 'user' as const;
export const QUERY_KEY_PLANS = 'plans' as const;

export const AUTH_SESSION_COOKIE = 'auth_session';

/**
 * Name of the HttpOnly refresh-token cookie set by the backend. Must match the
 * backend's REFRESH_COOKIE_NAME env var (defaults to `mentorix_refresh`).
 */
export const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'mentorix_refresh';

/** Trigger a proactive access-token refresh this many ms before it expires. */
export const REFRESH_BUFFER_MS = 30_000;

/** Fallback refresh-token lifetime (30 days) when the Set-Cookie omits Max-Age/Expires. */
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1_000;
