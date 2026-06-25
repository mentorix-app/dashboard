import 'server-only';

import {
  MENTORIX_API_BASE_URL,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  TIMEOUT_MS,
  messageFromErrorBody,
} from '@/src/shared/api';

export class BackendError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
  }
}

type BackendFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** JSON-serialisable body. */
  body?: unknown;
  /** Bearer token to attach. */
  token?: string;
  /** Raw `Cookie` header value to attach (e.g. the refresh cookie). */
  cookie?: string;
  /** Forwarded query string (already encoded), without leading `?`. */
  search?: string;
  signal?: AbortSignal;
};

/** Parsed refresh cookie extracted from a backend `Set-Cookie` response. */
export type RefreshCookie = {
  token: string;
  /** ISO timestamp when the refresh token expires. */
  expiresAt: string;
};

const baseUrl = MENTORIX_API_BASE_URL.replace(/\/$/, '');

const buildHeaders = (token?: string, cookie?: string): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(cookie ? { Cookie: cookie } : {}),
});

/**
 * Server-side fetch wrapper for the Mentorix backend. Throws `BackendError`
 * on non-2xx responses with a best-effort message extracted from the body.
 */
export async function backendFetch<TData>(path: string, options: BackendFetchOptions = {}): Promise<TData> {
  const { data } = await backendFetchRaw<TData>(path, options);
  return data;
}

/**
 * Like `backendFetch` but also returns the raw `Set-Cookie` headers so callers
 * can capture the backend's HttpOnly refresh cookie.
 */
export async function backendFetchRaw<TData>(
  path: string,
  options: BackendFetchOptions = {}
): Promise<{ data: TData; setCookie: string[] }> {
  const { method = 'GET', body, token, cookie, search, signal } = options;

  const url = `${baseUrl}${path}${search ? `?${search}` : ''}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const res = await fetch(url, {
      method,
      headers: buildHeaders(token, cookie),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    const data: unknown = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      const message = messageFromErrorBody(data) ?? res.statusText ?? 'Request failed';
      throw new BackendError(message, res.status);
    }

    return { data: data as TData, setCookie: res.headers.getSetCookie() };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Extracts the refresh token and its expiry from a backend `Set-Cookie` list.
 * Falls back to {@link REFRESH_TOKEN_TTL_MS} when no Max-Age/Expires is present.
 */
export const parseRefreshCookie = (setCookie: string[]): RefreshCookie | null => {
  const header = setCookie.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
  if (!header) return null;

  const segments = header.split(';').map((s) => s.trim());
  const token = segments[0]?.slice(REFRESH_COOKIE_NAME.length + 1) ?? '';
  if (!token) return null;

  const maxAge = segments.find((s) => s.toLowerCase().startsWith('max-age='));
  const expires = segments.find((s) => s.toLowerCase().startsWith('expires='));

  let expiresAt: string;
  if (maxAge) {
    const seconds = Number(maxAge.slice('max-age='.length));
    expiresAt = new Date(
      Date.now() + (Number.isFinite(seconds) ? seconds * 1_000 : REFRESH_TOKEN_TTL_MS)
    ).toISOString();
  } else if (expires) {
    const parsed = new Date(expires.slice('expires='.length));
    expiresAt = Number.isNaN(parsed.getTime())
      ? new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString()
      : parsed.toISOString();
  } else {
    expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString();
  }

  return { token, expiresAt };
};

const safeJsonParse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
