import { NextResponse, type NextRequest } from 'next/server';
import { BFF_CLIENT_IP_HEADER, BFF_SECRET_HEADER, MENTORIX_API_BASE_URL } from '@/src/shared/api';
import {
  deleteSessionCookie,
  forceRefresh,
  isAccessTokenValid,
  refreshSessionIfNeeded,
} from '@/src/entities/auth/server/dal';
import { convertObjectKeys, toCamelCase, toSnakeCase } from '@/src/shared/lib';

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

// Only this server may tell the API a browser address (it holds the shared
// secret), so whatever a browser sends under these names is never forwarded.
const BFF_ONLY_HEADERS = new Set([BFF_CLIENT_IP_HEADER, BFF_SECRET_HEADER]);

const isJson = (headers: Headers): boolean => (headers.get('content-type') ?? '').includes('application/json');

// The session is intact but cannot be refreshed right now. Unlike a 401 this
// does not send the client to /login, where the still-valid cookie would bounce
// it straight back and spend the shared refresh rate limit on every lap.
const refreshUnavailable = (retryAfterMs: number): NextResponse =>
  NextResponse.json(
    { code: 'session_refresh_unavailable', message: 'Session refresh is temporarily unavailable' },
    { status: 503, headers: { 'Retry-After': String(Math.max(1, Math.ceil(retryAfterMs / 1_000))) } }
  );

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
  const state = await refreshSessionIfNeeded();
  if (state.status === 'none') {
    return new NextResponse(null, { status: 401 });
  }
  // While the access token is still valid the request goes out with it, even if
  // the proactive refresh just failed for a transient reason.
  if (state.status === 'unavailable' && !isAccessTokenValid(state.session)) {
    return refreshUnavailable(state.retryAfterMs);
  }
  const { session } = state;

  const { path = [] } = await ctx.params;
  const upstreamPath = '/' + path.map(encodeURIComponent).join('/');
  const url = `${baseUrl}${upstreamPath}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase()) && !BFF_ONLY_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let body: BodyInit | undefined;
  if (hasBody) {
    if (isJson(req.headers)) {
      const text = await req.text();
      if (text) {
        const parsed: unknown = JSON.parse(text);
        body = JSON.stringify(convertObjectKeys(parsed, toSnakeCase));
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
    const forced = await forceRefresh();
    if (forced.status === 'unavailable') {
      return refreshUnavailable(forced.retryAfterMs);
    }
    if (forced.status === 'active') {
      upstream = await send(forced.session.accessToken);
    }
  }

  // The backend still rejects us after a refresh attempt: the session is dead.
  // Clear the encrypted session cookie so the middleware's optimistic check
  // fails and the client redirect to /login actually sticks. Without this the
  // still-valid cookie makes the middleware bounce the user back into the app,
  // producing an infinite 401 -> /login -> dashboard reload loop.
  if (upstream.status === 401) {
    await deleteSessionCookie();
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  if (isJson(upstream.headers)) {
    const text = await upstream.text();
    const payload = text ? JSON.stringify(convertObjectKeys(JSON.parse(text) as unknown, toCamelCase)) : null;

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
