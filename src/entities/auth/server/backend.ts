import 'server-only';

import {
  BFF_CLIENT_IP_HEADER,
  BFF_SECRET_HEADER,
  MENTORIX_API_BASE_URL,
  TIMEOUT_MS,
  messageFromErrorBody,
} from '@/src/shared/api';

import { parseRetryAfterMs } from './retryAfter.utils';

export class BackendError extends Error {
  readonly status: number;
  /** Milliseconds from the response's `Retry-After` header, when it carried a usable one. */
  readonly retryAfterMs?: number;

  constructor(message: string, status: number, retryAfterMs?: number) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

type BackendFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** JSON-serialisable body. */
  body?: unknown;
  /** Bearer access token to attach. */
  token?: string;
  /** Forwarded query string (already encoded), without leading `?`. */
  search?: string;
  /**
   * Browser address to count the API's auth rate limits by. Sent together with
   * the shared secret, and only when `BFF_SHARED_SECRET` is configured.
   */
  clientIp?: string | null;
  signal?: AbortSignal;
};

const baseUrl = MENTORIX_API_BASE_URL.replace(/\/$/, '');

const buildHeaders = (token?: string, clientIp?: string | null): HeadersInit => {
  const secret = process.env.BFF_SHARED_SECRET;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(clientIp && secret ? { [BFF_CLIENT_IP_HEADER]: clientIp, [BFF_SECRET_HEADER]: secret } : {}),
  };
};

/**
 * Server-side fetch wrapper for the Mentorix backend. Throws `BackendError`
 * on non-2xx responses with a best-effort message extracted from the body.
 */
export async function backendFetch<TData>(path: string, options: BackendFetchOptions = {}): Promise<TData> {
  const { method = 'GET', body, token, search, clientIp, signal } = options;

  const url = `${baseUrl}${path}${search ? `?${search}` : ''}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const res = await fetch(url, {
      method,
      headers: buildHeaders(token, clientIp),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    const data: unknown = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      const message = messageFromErrorBody(data) ?? res.statusText ?? 'Request failed';
      throw new BackendError(message, res.status, parseRetryAfterMs(res.headers.get('retry-after')));
    }

    return data as TData;
  } finally {
    clearTimeout(timeout);
  }
}

const safeJsonParse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
