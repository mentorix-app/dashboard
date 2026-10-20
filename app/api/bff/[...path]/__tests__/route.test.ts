/**
 * @jest-environment node
 *
 * This is a server-only API route; jsdom doesn't provide the Fetch API
 * globals (`Request`/`Response`/`Headers`) that `next/server` builds on.
 */

jest.mock('../../../../../src/entities/auth/server/dal', () => ({
  refreshSessionIfNeeded: jest.fn(),
  forceRefresh: jest.fn(),
  deleteSessionCookie: jest.fn(),
  // A plain function (not jest.fn) so `resetAllMocks` leaves the real logic in place.
  isAccessTokenValid: (session: { accessExpiresAt: string }) =>
    new Date(session.accessExpiresAt).getTime() > Date.now(),
}));

jest.mock('../../../../../src/shared/api', () => ({
  MENTORIX_API_BASE_URL: 'https://backend.test',
  BFF_CLIENT_IP_HEADER: 'x-mentorix-client-ip',
  BFF_SECRET_HEADER: 'x-mentorix-bff-secret',
}));

import { NextRequest } from 'next/server';
import { deleteSessionCookie, forceRefresh, refreshSessionIfNeeded } from '../../../../../src/entities/auth/server/dal';
import { DELETE, GET, PATCH, POST, PUT } from '../route';

const mockedRefresh = refreshSessionIfNeeded as jest.Mock;
const mockedForceRefresh = forceRefresh as jest.Mock;
const mockedDeleteCookie = deleteSessionCookie as jest.Mock;

const validSession = (accessToken: string) => ({
  accessToken,
  accessExpiresAt: new Date(Date.now() + 600_000).toISOString(),
});
const expiredSession = (accessToken: string) => ({
  accessToken,
  accessExpiresAt: new Date(Date.now() - 1_000).toISOString(),
});

const active = (accessToken: string) => ({ status: 'active', session: validSession(accessToken) });

const buildRequest = (path: string, init: ConstructorParameters<typeof NextRequest>[1] = {}): NextRequest =>
  new NextRequest(new URL(path, 'http://localhost/api/bff'), init);

const ctx = (path: string[]): { params: Promise<{ path?: string[] }> } => ({ params: Promise.resolve({ path }) });

const jsonResponse = (body: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(body), {
    status: 200,
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers as Record<string, string> | undefined) },
  });

describe('BFF route handler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedRefresh.mockResolvedValue(active('access-1'));
    global.fetch = jest.fn();
  });

  it('returns 401 without calling the backend when there is no session', async () => {
    mockedRefresh.mockResolvedValue({ status: 'none' });

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(res.status).toBe(401);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('forwards the request to the backend with the bearer token and joined path', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ user_name: 'Ada' }));

    await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(global.fetch).toHaveBeenCalledWith(
      'https://backend.test/users/1',
      expect.objectContaining({ method: 'GET' })
    );
    const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer access-1');
  });

  it('converts a snake_case JSON response body to camelCase', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ user_name: 'Ada', nested_field: { deep_key: 1 } }));

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));
    const data: unknown = await res.json();

    expect(data).toEqual({ userName: 'Ada', nestedField: { deepKey: 1 } });
  });

  it('converts a camelCase JSON request body to snake_case before forwarding', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ ok: true }));

    await POST(
      buildRequest('/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userName: 'Ada' }),
      }),
      ctx(['users'])
    );

    const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ user_name: 'Ada' });
  });

  it('preserves an empty client list while converting its request key to snake_case', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ ok: true }));

    await PUT(
      buildRequest('/programs/1/weeks/2/blocks/3/clients', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ clientUserIds: [] }),
      }),
      ctx(['programs', '1', 'weeks', '2', 'blocks', '3', 'clients'])
    );

    const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ client_user_ids: [] });
  });

  it('strips hop-by-hop request headers before forwarding', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({}));

    await GET(
      buildRequest('/users/1', { headers: { connection: 'keep-alive', 'x-custom': 'yes' } }),
      ctx(['users', '1'])
    );

    const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('connection')).toBeNull();
    expect(headers.get('x-custom')).toBe('yes');
  });

  it('never forwards the browser-address headers a client sends', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({}));

    await GET(
      buildRequest('/users/1', {
        headers: { 'X-Mentorix-Client-IP': '198.51.100.1', 'X-Mentorix-BFF-Secret': 'guess', 'x-custom': 'yes' },
      }),
      ctx(['users', '1'])
    );

    const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('x-mentorix-client-ip')).toBeNull();
    expect(headers.get('x-mentorix-bff-secret')).toBeNull();
    expect(headers.get('x-custom')).toBe('yes');
  });

  it('retries once with a forced-refresh token after a 401 from the backend', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));
    mockedForceRefresh.mockResolvedValue(active('access-2'));

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const [, secondInit] = (global.fetch as jest.Mock).mock.calls[1] as [string, RequestInit];
    expect((secondInit.headers as Headers).get('Authorization')).toBe('Bearer access-2');
    expect(res.status).toBe(200);
    expect(mockedDeleteCookie).not.toHaveBeenCalled();
  });

  it('clears the session cookie when a 401 persists after a forced refresh', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));
    mockedForceRefresh.mockResolvedValue(active('access-2'));

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(res.status).toBe(401);
    expect(mockedDeleteCookie).toHaveBeenCalledTimes(1);
  });

  it('clears the session cookie when the forced refresh finds no session', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));
    mockedForceRefresh.mockResolvedValue({ status: 'none' });

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(res.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockedDeleteCookie).toHaveBeenCalledTimes(1);
  });

  describe('when the session cannot be refreshed for now', () => {
    it('still forwards the request while the access token is valid', async () => {
      mockedRefresh.mockResolvedValue({
        status: 'unavailable',
        session: validSession('access-live'),
        retryAfterMs: 30_000,
      });
      (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ ok: true }));

      const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

      expect(res.status).toBe(200);
      const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
      expect((init.headers as Headers).get('Authorization')).toBe('Bearer access-live');
    });

    it('answers 503 with Retry-After, not 401, once the access token has expired', async () => {
      mockedRefresh.mockResolvedValue({
        status: 'unavailable',
        session: expiredSession('access-old'),
        retryAfterMs: 90_500,
      });

      const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

      expect(res.status).toBe(503);
      expect(res.headers.get('retry-after')).toBe('91');
      await expect(res.json()).resolves.toMatchObject({ code: 'session_refresh_unavailable' });
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockedDeleteCookie).not.toHaveBeenCalled();
    });

    it('answers 503 and keeps the cookie when a 401 cannot be recovered by a refresh', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));
      mockedForceRefresh.mockResolvedValue({
        status: 'unavailable',
        session: validSession('access-1'),
        retryAfterMs: 30_000,
      });

      const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

      expect(res.status).toBe(503);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockedDeleteCookie).not.toHaveBeenCalled();
    });
  });

  it('passes non-JSON response bodies through unmodified', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response('binary-data', { headers: { 'content-type': 'application/octet-stream' } })
    );

    const res = await GET(buildRequest('/files/1'), ctx(['files', '1']));
    const text = await res.text();

    expect(text).toBe('binary-data');
  });

  it('exposes PUT, PATCH, and DELETE handlers that all forward to the backend', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => jsonResponse({ ok: true }));

    await PUT(buildRequest('/users/1', { method: 'PUT' }), ctx(['users', '1']));
    await PATCH(buildRequest('/users/1', { method: 'PATCH' }), ctx(['users', '1']));
    await DELETE(buildRequest('/users/1', { method: 'DELETE' }), ctx(['users', '1']));

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
