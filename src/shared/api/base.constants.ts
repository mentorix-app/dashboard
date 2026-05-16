export const MENTORIX_API_BASE_URL = process.env.NEXT_PUBLIC_MENTORIX_API_URL || '';

/** Local backend-for-frontend mount point. Browser-side axios targets this. */
export const BFF_BASE_URL = '/api/bff';

export const TIMEOUT_MS = 15_000;

export const QUERY_KEY_AUTH = 'auth' as const;
export const QUERY_KEY_EXERCISES = 'exercises' as const;

export const AUTH_SESSION_COOKIE = 'auth_session';

/** Trigger a proactive token refresh this many ms before the token expires. */
export const REFRESH_BUFFER_MS = 30_000;
