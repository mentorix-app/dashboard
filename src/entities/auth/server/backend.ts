import 'server-only';

import { MENTORIX_API_BASE_URL, TIMEOUT_MS, messageFromErrorBody } from '@/src/shared/api';

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
  /** Forwarded query string (already encoded), without leading `?`. */
  search?: string;
  signal?: AbortSignal;
};

const baseUrl = MENTORIX_API_BASE_URL.replace(/\/$/, '');

/**
 * Server-side fetch wrapper for the Mentorix backend. Throws `BackendError`
 * on non-2xx responses with a best-effort message extracted from the body.
 */
export async function backendFetch<TData>(path: string, options: BackendFetchOptions = {}): Promise<TData> {
  const { method = 'GET', body, token, search, signal } = options;

  const url = `${baseUrl}${path}${search ? `?${search}` : ''}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
