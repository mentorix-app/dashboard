import { NextResponse, type NextRequest } from 'next/server';
import { MENTORIX_API_BASE_URL } from '@/src/shared/api';
import { forceRefresh, refreshSessionIfNeeded } from '@/src/entities/auth/server/dal';

const baseUrl = MENTORIX_API_BASE_URL.replace(/\/$/, '');

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'accept-encoding',
  'content-encoding',
]);

const toCamel = (key: string): string => key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

const toSnake = (key: string): string => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

const convertKeys = (value: unknown, convert: (key: string) => string): unknown => {
  if (Array.isArray(value)) return value.map((item) => convertKeys(item, convert));

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [convert(key), convertKeys(val, convert)])
    );
  }

  return value;
};

const isJson = (headers: Headers): boolean => (headers.get('content-type') ?? '').includes('application/json');

/**
 * Catch-all backend-for-frontend route. Client-side TanStack Query calls hit
 * `/api/bff/*`; this handler attaches the bearer from the encrypted session
 * cookie and forwards to the real backend. The token never leaves the server.
 *
 * It is also the single case-conversion boundary: JSON request bodies are
 * converted camelCase -> snake_case on the way out and JSON response bodies
 * snake_case -> camelCase on the way back, so entities never touch backend
 * field casing.
 */
const handle = async (req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }): Promise<Response> => {
  const session = await refreshSessionIfNeeded();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const { path = [] } = await ctx.params;
  const upstreamPath = '/' + path.map(encodeURIComponent).join('/');
  const url = `${baseUrl}${upstreamPath}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
  });

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let body: BodyInit | undefined;
  if (hasBody) {
    if (isJson(req.headers)) {
      const text = await req.text();
      if (text) {
        const parsed: unknown = JSON.parse(text);
        body = JSON.stringify(convertKeys(parsed, toSnake));
      }
    } else {
      body = await req.arrayBuffer();
    }
  }

  // Buffered above so the request can be replayed once after a refresh.
  const send = (accessToken: string): Promise<Response> => {
    headers.set('Authorization', `Bearer ${accessToken}`);
    return fetch(url, {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
    });
  };

  let upstream = await send(session.accessToken);

  // The access token can still be rejected (revoked, or expired within the
  // proactive-refresh buffer). Try one forced refresh + replay before giving up;
  // a persistent 401 falls through to the client, which redirects to login.
  if (upstream.status === 401) {
    const refreshed = await forceRefresh();
    if (refreshed) {
      upstream = await send(refreshed.accessToken);
    }
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  if (isJson(upstream.headers)) {
    const text = await upstream.text();
    const payload = text ? JSON.stringify(convertKeys(JSON.parse(text) as unknown, toCamel)) : null;

    return new NextResponse(payload, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
