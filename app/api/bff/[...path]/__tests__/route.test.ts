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
}));

jest.mock('../../../../../src/shared/api', () => ({
  MENTORIX_API_BASE_URL: 'https://backend.test',
}));

import { NextRequest } from 'next/server';
import { deleteSessionCookie, forceRefresh, refreshSessionIfNeeded } from '../../../../../src/entities/auth/server/dal';
import { DELETE, GET, PATCH, POST, PUT } from '../route';

const mockedRefresh = refreshSessionIfNeeded as jest.Mock;
const mockedForceRefresh = forceRefresh as jest.Mock;
const mockedDeleteCookie = deleteSessionCookie as jest.Mock;

const session = { accessToken: 'access-1' };

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
    mockedRefresh.mockResolvedValue(session);
    global.fetch = jest.fn();
  });

  it('returns 401 without calling the backend when there is no session', async () => {
    mockedRefresh.mockResolvedValue(null);

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

  it('retries once with a forced-refresh token after a 401 from the backend', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));
    mockedForceRefresh.mockResolvedValue({ accessToken: 'access-2' });

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const [, secondInit] = (global.fetch as jest.Mock).mock.calls[1] as [string, RequestInit];
    expect((secondInit.headers as Headers).get('Authorization')).toBe('Bearer access-2');
    expect(res.status).toBe(200);
    expect(mockedDeleteCookie).not.toHaveBeenCalled();
  });

  it('clears the session cookie when a 401 persists after a forced refresh', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));
    mockedForceRefresh.mockResolvedValue({ accessToken: 'access-2' });

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(res.status).toBe(401);
    expect(mockedDeleteCookie).toHaveBeenCalledTimes(1);
  });

  it('clears the session cookie when forceRefresh itself fails to produce a session', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));
    mockedForceRefresh.mockResolvedValue(null);

    const res = await GET(buildRequest('/users/1'), ctx(['users', '1']));

    expect(res.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockedDeleteCookie).toHaveBeenCalledTimes(1);
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
