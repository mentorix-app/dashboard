jest.mock('server-only', () => ({}));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('next/headers', () => ({ cookies: jest.fn() }));

jest.mock('../backend', () => {
  const actual = jest.requireActual('../backend');
  return { ...actual, backendFetch: jest.fn() };
});
jest.mock('../signIn', () => ({ signInWithProvider: jest.fn() }));
jest.mock('../deleteAccount', () => ({ deleteAccount: jest.fn() }));
jest.mock('../session', () => ({
  getSession: jest.fn(),
  deleteSessionCookie: jest.fn(),
}));

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/src/shared/lib';
import { BackendError, backendFetch } from '../backend';
import { deleteAccountAction, googleSignInAction, logoutAction, prepareGoogleSignInAction } from '../actions';
import { deleteAccount } from '../deleteAccount';
import { hashNonce } from '../nonce.utils';
import { deleteSessionCookie, getSession } from '../session';
import { signInWithProvider } from '../signIn';
import type { AuthSession } from '../session.types';

const mockedRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockedCookies = cookies as jest.Mock;
const mockedFetch = backendFetch as jest.MockedFunction<typeof backendFetch>;
const mockedSignIn = signInWithProvider as jest.MockedFunction<typeof signInWithProvider>;
const mockedDeleteAccount = deleteAccount as jest.MockedFunction<typeof deleteAccount>;
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockedDelete = deleteSessionCookie as jest.MockedFunction<typeof deleteSessionCookie>;

const session: AuthSession = {
  accessToken: 'access-1',
  accessExpiresAt: new Date(Date.now() + 900_000).toISOString(),
  refreshToken: 'refresh-1',
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  userId: 'u1',
  email: 'a@b.com',
};

const store = { get: jest.fn(), set: jest.fn(), delete: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
  mockedCookies.mockResolvedValue(store);
  mockedRedirect.mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  });
});

describe('prepareGoogleSignInAction', () => {
  it('keeps the raw nonce in an HttpOnly cookie and returns only its hash', async () => {
    const { nonce } = await prepareGoogleSignInAction();

    const [name, raw, options] = store.set.mock.calls[0] as [string, string, Record<string, unknown>];
    expect(name).toBe('google_nonce');
    expect(options).toMatchObject({ httpOnly: true, sameSite: 'lax', path: '/', maxAge: 600 });
    expect(raw).not.toBe(nonce);
    expect(nonce).toBe(hashNonce(raw));
    expect(nonce).toMatch(/^[0-9a-f]{64}$/);
  });

  it('creates a different nonce every time', async () => {
    const first = await prepareGoogleSignInAction();
    const second = await prepareGoogleSignInAction();

    expect(first.nonce).not.toBe(second.nonce);
  });
});

describe('googleSignInAction', () => {
  it('rejects an empty credential without calling the API', async () => {
    await expect(googleSignInAction('')).resolves.toEqual({ errorCode: 'invalid_token' });
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it('sends the credential with the raw nonce, spends the nonce and redirects to the dashboard', async () => {
    store.get.mockReturnValue({ value: 'raw-nonce' });
    mockedSignIn.mockResolvedValue({ ok: true });

    await expect(googleSignInAction('credential')).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedSignIn).toHaveBeenCalledWith('google', { id_token: 'credential', nonce: 'raw-nonce' });
    expect(store.delete).toHaveBeenCalledWith('google_nonce');
    expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.dashboard);
  });

  it('still signs in when the nonce cookie is gone (the API treats the nonce as optional)', async () => {
    store.get.mockReturnValue(undefined);
    mockedSignIn.mockResolvedValue({ ok: true });

    await expect(googleSignInAction('credential')).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedSignIn).toHaveBeenCalledWith('google', { id_token: 'credential' });
  });

  it('returns the failure code and does not redirect on a rejected token', async () => {
    store.get.mockReturnValue({ value: 'raw-nonce' });
    mockedSignIn.mockResolvedValue({ ok: false, errorCode: 'invalid_token' });

    await expect(googleSignInAction('credential')).resolves.toEqual({
      errorCode: 'invalid_token',
      retryAfterSeconds: undefined,
    });
    expect(store.delete).toHaveBeenCalledWith('google_nonce');
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it('passes the wait of a rate limit on to the UI', async () => {
    store.get.mockReturnValue(undefined);
    mockedSignIn.mockResolvedValue({ ok: false, errorCode: 'rate_limited', retryAfterSeconds: 90 });

    await expect(googleSignInAction('credential')).resolves.toEqual({
      errorCode: 'rate_limited',
      retryAfterSeconds: 90,
    });
  });
});

describe('logoutAction', () => {
  it('revokes the backend session with the refresh token in the body, clears the cookie and redirects to login', async () => {
    mockedGetSession.mockResolvedValue(session);
    mockedFetch.mockResolvedValue(undefined);

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedFetch).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
      body: { refresh_token: session.refreshToken },
    });
    expect(mockedDelete).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.login);
  });

  it('still clears the cookie and redirects when the backend call fails', async () => {
    mockedGetSession.mockResolvedValue(session);
    mockedFetch.mockRejectedValue(new BackendError('down', 500));

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedDelete).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.login);
  });

  it('skips the backend call and just redirects when there is no session', async () => {
    mockedGetSession.mockResolvedValue(null);

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(mockedDelete).toHaveBeenCalledTimes(1);
  });
});

describe('deleteAccountAction', () => {
  it('returns nothing once the account is deleted', async () => {
    mockedDeleteAccount.mockResolvedValue({ ok: true });

    await expect(deleteAccountAction()).resolves.toBeUndefined();
    expect(mockedDeleteAccount).toHaveBeenCalledWith();
  });

  it('returns the reason when the account was not deleted', async () => {
    mockedDeleteAccount.mockResolvedValue({ ok: false, errorCode: 'has_data' });

    await expect(deleteAccountAction()).resolves.toEqual({ errorCode: 'has_data' });
  });

  it('tells the UI to go through Apple when the API asks for it', async () => {
    mockedDeleteAccount.mockResolvedValue({ ok: false, errorCode: 'apple_required' });

    await expect(deleteAccountAction()).resolves.toEqual({ errorCode: 'apple_required' });
  });
});
