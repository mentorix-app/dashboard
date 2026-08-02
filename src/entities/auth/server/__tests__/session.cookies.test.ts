jest.mock('server-only', () => ({}));
jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('../session.crypto', () => ({
  encryptSession: jest.fn(),
  decryptSession: jest.fn(),
}));

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decryptSession, encryptSession } from '../session.crypto';
import { deleteSessionCookie, getSession, requireSession, writeSessionCookie } from '../session.cookies';
import type { AuthSession } from '../session.types';

type CookieStore = Awaited<ReturnType<typeof cookies>>;

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedEncrypt = encryptSession as jest.MockedFunction<typeof encryptSession>;
const mockedDecrypt = decryptSession as jest.MockedFunction<typeof decryptSession>;
const mockedRedirect = redirect as jest.MockedFunction<typeof redirect>;

const session: AuthSession = {
  accessToken: 'access-1',
  accessExpiresAt: new Date(Date.now() + 900_000).toISOString(),
  refreshToken: 'refresh-1',
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  userId: 'u1',
  email: 'a@b.com',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('writeSessionCookie', () => {
  it('encrypts the session and sets an HttpOnly cookie expiring with the refresh token', async () => {
    const set = jest.fn();
    mockedCookies.mockResolvedValue({ set } as unknown as CookieStore);
    mockedEncrypt.mockResolvedValue('encrypted-token');

    await writeSessionCookie(session);

    expect(mockedEncrypt).toHaveBeenCalledWith(session);
    expect(set).toHaveBeenCalledWith(
      'auth_session',
      'encrypted-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(session.refreshExpiresAt),
      })
    );
  });
});

describe('deleteSessionCookie', () => {
  it('deletes the auth session cookie', async () => {
    const del = jest.fn();
    mockedCookies.mockResolvedValue({ delete: del } as unknown as CookieStore);

    await deleteSessionCookie();

    expect(del).toHaveBeenCalledWith('auth_session');
  });
});

describe('getSession', () => {
  it('returns null when there is no session cookie', async () => {
    mockedCookies.mockResolvedValue({ get: () => undefined } as unknown as CookieStore);

    await expect(getSession()).resolves.toBeNull();
    expect(mockedDecrypt).not.toHaveBeenCalled();
  });

  it('decrypts the cookie value when present', async () => {
    mockedCookies.mockResolvedValue({ get: () => ({ value: 'enc-token' }) } as unknown as CookieStore);
    mockedDecrypt.mockResolvedValue(session);

    await expect(getSession()).resolves.toEqual(session);
    expect(mockedDecrypt).toHaveBeenCalledWith('enc-token');
  });
});

describe('requireSession', () => {
  it('returns the session when present', async () => {
    mockedCookies.mockResolvedValue({ get: () => ({ value: 'enc-token' }) } as unknown as CookieStore);
    mockedDecrypt.mockResolvedValue(session);

    await expect(requireSession()).resolves.toEqual(session);
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it('redirects to /login when there is no session', async () => {
    mockedCookies.mockResolvedValue({ get: () => undefined } as unknown as CookieStore);
    mockedRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(requireSession()).rejects.toThrow('NEXT_REDIRECT');
    expect(mockedRedirect).toHaveBeenCalledWith('/login');
  });
});
