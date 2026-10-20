jest.mock('server-only', () => ({}));

import { BackendError, backendFetch } from '../backend';

const originalFetch = global.fetch;
const originalSecret = process.env.BFF_SHARED_SECRET;

type MockResponseInit = {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
};

const mockResponse = (body: unknown, init: MockResponseInit = {}): Response => {
  const status = init.status ?? 200;
  const headers = init.headers ?? {};
  return {
    ok: status < 400,
    status,
    statusText: init.statusText ?? 'OK',
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
    headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
  } as unknown as Response;
};

const sentHeaders = (fetchMock: jest.Mock): Record<string, string> => {
  const [, options] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
  return options.headers;
};

afterEach(() => {
  global.fetch = originalFetch;
  if (originalSecret === undefined) delete process.env.BFF_SHARED_SECRET;
  else process.env.BFF_SHARED_SECRET = originalSecret;
  jest.restoreAllMocks();
});

describe('backendFetch', () => {
  it('returns the parsed data on success', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({ v: 1 }));

    await expect(backendFetch('/x')).resolves.toEqual({ v: 1 });
  });

  it('throws a BackendError with the parsed message on a non-2xx response', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({ message: 'Nope' }, { status: 400 }));

    await expect(backendFetch('/x')).rejects.toMatchObject({ message: 'Nope', status: 400 });
    await expect(backendFetch('/x')).rejects.toBeInstanceOf(BackendError);
  });

  it('falls back to statusText when the error body has no message', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({}, { status: 500, statusText: 'Server Error' }));

    await expect(backendFetch('/x')).rejects.toMatchObject({ message: 'Server Error', status: 500 });
  });

  it('carries the Retry-After of a 429 as milliseconds', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(mockResponse({ code: 'rate_limited' }, { status: 429, headers: { 'retry-after': '120' } }));

    await expect(backendFetch('/x')).rejects.toMatchObject({ status: 429, retryAfterMs: 120_000 });
  });

  it('leaves retryAfterMs undefined when there is no Retry-After header', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse({}, { status: 429 }));

    await expect(backendFetch('/x')).rejects.toMatchObject({ status: 429, retryAfterMs: undefined });
  });

  it('serialises a JSON body and attaches the bearer token', async () => {
    const fetchMock = jest.fn().mockResolvedValue(mockResponse(null));
    global.fetch = fetchMock;

    await backendFetch('/x', { method: 'POST', body: { a: 1 }, token: 'tok' });

    const [, options] = fetchMock.mock.calls[0];
    expect(options).toMatchObject({ method: 'POST', body: JSON.stringify({ a: 1 }) });
    expect(sentHeaders(fetchMock).Authorization).toBe('Bearer tok');
  });

  it('appends the forwarded query string', async () => {
    const fetchMock = jest.fn().mockResolvedValue(mockResponse(null));
    global.fetch = fetchMock;

    await backendFetch('/x', { search: 'a=1' });

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/x\?a=1$/);
  });

  it('treats a non-JSON body as plain text data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => 'not-json',
      headers: { get: () => null },
    } as unknown as Response);

    await expect(backendFetch('/x')).resolves.toBe('not-json');
  });

  describe('browser address forwarding', () => {
    it('sends the address and the shared secret when both are available', async () => {
      process.env.BFF_SHARED_SECRET = 'shared-secret';
      const fetchMock = jest.fn().mockResolvedValue(mockResponse(null));
      global.fetch = fetchMock;

      await backendFetch('/x', { clientIp: '203.0.113.7' });

      expect(sentHeaders(fetchMock)).toMatchObject({
        'x-mentorix-client-ip': '203.0.113.7',
        'x-mentorix-bff-secret': 'shared-secret',
      });
    });

    it('sends neither header without a configured secret', async () => {
      delete process.env.BFF_SHARED_SECRET;
      const fetchMock = jest.fn().mockResolvedValue(mockResponse(null));
      global.fetch = fetchMock;

      await backendFetch('/x', { clientIp: '203.0.113.7' });

      expect(sentHeaders(fetchMock)).not.toHaveProperty('x-mentorix-client-ip');
      expect(sentHeaders(fetchMock)).not.toHaveProperty('x-mentorix-bff-secret');
    });

    it('sends neither header without an address', async () => {
      process.env.BFF_SHARED_SECRET = 'shared-secret';
      const fetchMock = jest.fn().mockResolvedValue(mockResponse(null));
      global.fetch = fetchMock;

      await backendFetch('/x', { clientIp: null });

      expect(sentHeaders(fetchMock)).not.toHaveProperty('x-mentorix-bff-secret');
    });
  });
});
