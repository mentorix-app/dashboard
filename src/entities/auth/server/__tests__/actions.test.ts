jest.mock('server-only', () => ({}));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

jest.mock('../backend', () => {
  const actual = jest.requireActual('../backend');
  return { ...actual, backendFetch: jest.fn(), backendFetchRaw: jest.fn() };
});

jest.mock('../session', () => ({
  getSession: jest.fn(),
  writeSessionCookie: jest.fn(),
  deleteSessionCookie: jest.fn(),
  mapResponseToSession: jest.requireActual('../session.types').mapResponseToSession,
}));

import { redirect } from 'next/navigation';
import { ROUTES } from '@/src/shared/lib';
import { BackendError, backendFetch, backendFetchRaw } from '../backend';
import { deleteSessionCookie, getSession, writeSessionCookie } from '../session';
import { loginAction, logoutAction, signupAction } from '../actions';
import type { AuthSession, LoginResponse } from '../session.types';

const mockedRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockedFetchRaw = backendFetchRaw as jest.MockedFunction<typeof backendFetchRaw>;
const mockedFetch = backendFetch as jest.MockedFunction<typeof backendFetch>;
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockedWrite = writeSessionCookie as jest.MockedFunction<typeof writeSessionCookie>;
const mockedDelete = deleteSessionCookie as jest.MockedFunction<typeof deleteSessionCookie>;

const loginResponse: LoginResponse = {
  access_token: 'access-1',
  token_type: 'bearer',
  expires_at: new Date(Date.now() + 900_000).toISOString(),
  user_id: 'u1',
  email: 'a@b.com',
};

const session: AuthSession = {
  accessToken: 'access-1',
  accessExpiresAt: loginResponse.expires_at,
  refreshToken: 'refresh-1',
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  userId: 'u1',
  email: 'a@b.com',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedRedirect.mockImplementation(() => {
    throw new Error('NEXT_REDIRECT');
  });
});

describe('loginAction', () => {
  it('rejects invalid input without calling the backend', async () => {
    await expect(loginAction({ email: '', password: '' })).resolves.toEqual({
      error: 'Invalid email or password.',
    });
    expect(mockedFetchRaw).not.toHaveBeenCalled();
  });

  it('persists the session and redirects to the dashboard on success', async () => {
    mockedFetchRaw.mockResolvedValue({
      data: loginResponse,
      setCookie: ['mentorix_refresh=refresh-1; Max-Age=2592000; HttpOnly'],
    });

    await expect(loginAction({ email: 'a@b.com', password: 'secret' })).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedWrite).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'access-1' }));
    expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.dashboard);
  });

  it('returns a session error when the backend does not issue a refresh cookie', async () => {
    mockedFetchRaw.mockResolvedValue({ data: loginResponse, setCookie: [] });

    await expect(loginAction({ email: 'a@b.com', password: 'secret' })).resolves.toEqual({
      error: 'Could not establish a session. Please try signing in.',
    });
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it('maps a 401 BackendError to an invalid-credentials error', async () => {
    mockedFetchRaw.mockRejectedValue(new BackendError('unauthorized', 401));

    await expect(loginAction({ email: 'a@b.com', password: 'wrong' })).resolves.toEqual({
      error: 'Invalid email or password.',
    });
  });

  it('maps a non-401 BackendError to its own message', async () => {
    mockedFetchRaw.mockRejectedValue(new BackendError('upstream down', 503));

    await expect(loginAction({ email: 'a@b.com', password: 'secret' })).resolves.toEqual({
      error: 'upstream down',
    });
  });

  it('maps an unknown error to the generic error message', async () => {
    mockedFetchRaw.mockRejectedValue(new Error('boom'));

    await expect(loginAction({ email: 'a@b.com', password: 'secret' })).resolves.toEqual({
      error: 'Something went wrong. Please try again.',
    });
  });
});

describe('signupAction', () => {
  it('rejects invalid input without calling the backend', async () => {
    await expect(signupAction({ email: 'a@b.com', password: 'secret', name: '' })).resolves.toEqual({
      error: 'Something went wrong. Please try again.',
    });
    expect(mockedFetchRaw).not.toHaveBeenCalled();
  });

  it('persists the session and redirects to the welcome dashboard on success', async () => {
    mockedFetchRaw.mockResolvedValue({
      data: loginResponse,
      setCookie: ['mentorix_refresh=refresh-1; Max-Age=2592000; HttpOnly'],
    });

    await expect(signupAction({ email: 'a@b.com', password: 'secret', name: 'A' })).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedRedirect).toHaveBeenCalledWith(`${ROUTES.dashboard}?welcome=1`);
  });
});

describe('logoutAction', () => {
  it('revokes the backend session, clears the cookie, and redirects to login', async () => {
    mockedGetSession.mockResolvedValue(session);
    mockedFetch.mockResolvedValue(undefined);

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockedFetch).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
      cookie: `mentorix_refresh=${session.refreshToken}`,
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
