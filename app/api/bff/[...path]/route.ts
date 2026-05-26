import { NextResponse, type NextRequest } from 'next/server';
import { MENTORIX_API_BASE_URL } from '@/src/shared/api';
import { refreshSessionIfNeeded } from '@/src/entities/auth/server/dal';

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
]);

/**
 * Catch-all backend-for-frontend route. Client-side TanStack Query calls hit
 * `/api/bff/*`; this handler attaches the bearer from the encrypted session
 * cookie and forwards to the real backend. The token never leaves the server.
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
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

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
