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

/** Trigger a proactive access-token refresh this many ms before it expires. */
export const REFRESH_BUFFER_MS = 30_000;

/** Pause before the next refresh attempt after a network error, a timeout or a 5xx. */
export const REFRESH_TRANSIENT_COOLDOWN_MS = 30_000;

/** Pause after a 429 that carries no usable `Retry-After` header. */
export const REFRESH_RATE_LIMITED_COOLDOWN_MS = 5 * 60_000;

/** Upper bound for any refresh pause, so a huge `Retry-After` cannot lock a session out. */
export const REFRESH_MAX_COOLDOWN_MS = 60 * 60_000;

/** Headers the BFF sends so the API counts auth rate limits by the browser address. */
export const BFF_CLIENT_IP_HEADER = 'x-mentorix-client-ip';
export const BFF_SECRET_HEADER = 'x-mentorix-bff-secret';
