jest.mock('server-only', () => ({}));

import { REFRESH_COOKIE_NAME } from '@/src/shared/api';
import { BackendError, backendFetch, backendFetchRaw, parseRefreshCookie } from '../backend';

const originalFetch = global.fetch;

type MockResponseInit = {
  status?: number;
  statusText?: string;
  setCookie?: string[];
};

const mockResponse = (body: unknown, init: MockResponseInit = {}): Response => {
  const status = init.status ?? 200;
  return {
    ok: status < 400,
    status,
    statusText: init.statusText ?? 'OK',
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
    headers: { getSetCookie: () => init.setCookie ?? [] },
  } as unknown as Response;
};

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('backendFetchRaw', () => {
  it('returns the parsed data and Set-Cookie headers on success', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({ ok: true }, { setCookie: ['a=b'] }));

    await expect(backendFetchRaw('/x')).resolves.toEqual({ data: { ok: true }, setCookie: ['a=b'] });
  });

  it('throws a BackendError with the parsed message on a non-2xx response', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({ message: 'Nope' }, { status: 400 }));

    await expect(backendFetchRaw('/x')).rejects.toMatchObject({ message: 'Nope', status: 400 });
    await expect(backendFetchRaw('/x')).rejects.toBeInstanceOf(BackendError);
  });

  it('falls back to statusText when the error body has no message', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({}, { status: 500, statusText: 'Server Error' }));

    await expect(backendFetchRaw('/x')).rejects.toMatchObject({ message: 'Server Error', status: 500 });
  });

  it('serialises a JSON body and attaches bearer/cookie headers', async () => {
    const fetchMock = jest.fn().mockResolvedValue(mockResponse(null));
    global.fetch = fetchMock;

    await backendFetchRaw('/x', { method: 'POST', body: { a: 1 }, token: 'tok', cookie: 'c=1' });

    const [, options] = fetchMock.mock.calls[0];
    expect(options).toMatchObject({
      method: 'POST',
      body: JSON.stringify({ a: 1 }),
      headers: expect.objectContaining({ Authorization: 'Bearer tok', Cookie: 'c=1' }),
    });
  });

  it('treats a non-JSON body as plain text data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => 'not-json',
      headers: { getSetCookie: () => [] },
    } as unknown as Response);

    await expect(backendFetchRaw('/x')).resolves.toEqual({ data: 'not-json', setCookie: [] });
  });
});

describe('backendFetch', () => {
  it('returns just the data payload', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({ v: 1 }));

    await expect(backendFetch('/x')).resolves.toEqual({ v: 1 });
  });
});

describe('parseRefreshCookie', () => {
  it('returns null when the refresh cookie is absent', () => {
    expect(parseRefreshCookie(['other=1'])).toBeNull();
  });

  it('returns null when the cookie has no token value', () => {
    expect(parseRefreshCookie([`${REFRESH_COOKIE_NAME}=`])).toBeNull();
  });

  it('parses the token and a Max-Age based expiry', () => {
    const result = parseRefreshCookie([`${REFRESH_COOKIE_NAME}=abc; Max-Age=3600; HttpOnly`]);

    expect(result?.token).toBe('abc');
    expect(new Date(result!.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('parses the Expires attribute when Max-Age is absent', () => {
    const future = new Date(Date.now() + 60_000).toUTCString();

    const result = parseRefreshCookie([`${REFRESH_COOKIE_NAME}=abc; Expires=${future}`]);

    expect(result?.expiresAt).toBe(new Date(future).toISOString());
  });

  it('falls back to the default TTL when neither Max-Age nor Expires is present', () => {
    const before = Date.now();
    const result = parseRefreshCookie([`${REFRESH_COOKIE_NAME}=abc`]);

    expect(result?.token).toBe('abc');
    expect(new Date(result!.expiresAt).getTime()).toBeGreaterThan(before);
  });
});
