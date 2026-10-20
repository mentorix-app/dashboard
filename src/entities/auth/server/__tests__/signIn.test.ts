jest.mock('server-only', () => ({}));

jest.mock('../backend', () => {
  const actual = jest.requireActual('../backend');
  return { ...actual, backendFetch: jest.fn() };
});
jest.mock('../clientAddress', () => ({ getClientAddress: jest.fn() }));
jest.mock('../session.cookies', () => ({ writeSessionCookie: jest.fn() }));

import { BackendError, backendFetch } from '../backend';
import { getClientAddress } from '../clientAddress';
import { writeSessionCookie } from '../session.cookies';
import { mapAuthError, signInWithProvider } from '../signIn';
import type { LoginResponse } from '../session.types';

const mockedFetch = backendFetch as jest.MockedFunction<typeof backendFetch>;
const mockedAddress = getClientAddress as jest.MockedFunction<typeof getClientAddress>;
const mockedWrite = writeSessionCookie as jest.MockedFunction<typeof writeSessionCookie>;

const response: LoginResponse = {
  access_token: 'access-1',
  token_type: 'bearer',
  expires_at: '2026-10-20T10:15:00Z',
  refresh_expires_at: '2026-11-19T10:00:00Z',
  refresh_token: 'refresh-1',
  user_id: 'u1',
  email: 'a@b.com',
};

beforeEach(() => {
  jest.resetAllMocks();
  mockedAddress.mockResolvedValue('203.0.113.7');
});

describe('mapAuthError', () => {
  it.each([
    [401, { errorCode: 'invalid_token' }],
    [429, { errorCode: 'rate_limited' }],
    [500, { errorCode: 'unavailable' }],
    [503, { errorCode: 'unavailable' }],
    [400, { errorCode: 'unknown' }],
  ])('maps a %i to %o', (status, expected) => {
    expect(mapAuthError(new BackendError('x', status))).toEqual(expected);
  });

  it('rounds the Retry-After of a 429 up to whole seconds', () => {
    expect(mapAuthError(new BackendError('x', 429, 1_200))).toEqual({
      errorCode: 'rate_limited',
      retryAfterSeconds: 2,
    });
  });

  it('maps anything that is not a BackendError to unknown', () => {
    expect(mapAuthError(new Error('boom'))).toEqual({ errorCode: 'unknown' });
  });
});

describe('signInWithProvider', () => {
  it('posts the token to the provider endpoint with the browser address and stores the session', async () => {
    mockedFetch.mockResolvedValue(response);

    await expect(signInWithProvider('google', { id_token: 'idt', nonce: 'raw' })).resolves.toEqual({ ok: true });

    expect(mockedFetch).toHaveBeenCalledWith('/auth/google', {
      method: 'POST',
      body: { id_token: 'idt', nonce: 'raw' },
      clientIp: '203.0.113.7',
    });
    expect(mockedWrite).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        refreshExpiresAt: '2026-11-19T10:00:00Z',
        userId: 'u1',
      })
    );
  });

  it('uses the Apple endpoint for Apple', async () => {
    mockedFetch.mockResolvedValue(response);

    await signInWithProvider('apple', { id_token: 'idt', name: 'Ada' });

    expect(mockedFetch).toHaveBeenCalledWith(
      '/auth/apple',
      expect.objectContaining({ body: { id_token: 'idt', name: 'Ada' } })
    );
  });

  it('fails without storing anything when the API sends no refresh token', async () => {
    mockedFetch.mockResolvedValue({ ...response, refresh_token: undefined });

    await expect(signInWithProvider('google', { id_token: 'idt' })).resolves.toEqual({
      ok: false,
      errorCode: 'session_failed',
    });
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('reports a rejected token', async () => {
    mockedFetch.mockRejectedValue(new BackendError('invalid id token', 401));

    await expect(signInWithProvider('google', { id_token: 'bad' })).resolves.toEqual({
      ok: false,
      errorCode: 'invalid_token',
    });
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('reports a rate limit with the wait the API asked for', async () => {
    mockedFetch.mockRejectedValue(new BackendError('too many requests', 429, 30_000));

    await expect(signInWithProvider('apple', { id_token: 'idt' })).resolves.toEqual({
      ok: false,
      errorCode: 'rate_limited',
      retryAfterSeconds: 30,
    });
  });
});
