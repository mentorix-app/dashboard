jest.mock('server-only', () => ({}));
jest.mock('../backend', () => {
  const actual = jest.requireActual('../backend');
  return { ...actual, backendFetch: jest.fn() };
});
jest.mock('../session', () => ({
  deleteSessionCookie: jest.fn(),
  refreshSessionIfNeeded: jest.fn(),
  isAccessTokenValid: jest.fn(),
}));

import { BackendError, backendFetch } from '../backend';
import { deleteAccount, mapDeleteAccountError } from '../deleteAccount';
import { deleteSessionCookie, isAccessTokenValid, refreshSessionIfNeeded } from '../session';
import type { AuthSession } from '../session.types';

const mockedFetch = backendFetch as jest.MockedFunction<typeof backendFetch>;
const mockedRefresh = refreshSessionIfNeeded as jest.MockedFunction<typeof refreshSessionIfNeeded>;
const mockedValid = isAccessTokenValid as jest.MockedFunction<typeof isAccessTokenValid>;
const mockedDeleteCookie = deleteSessionCookie as jest.MockedFunction<typeof deleteSessionCookie>;

const session: AuthSession = {
  accessToken: 'access-1',
  accessExpiresAt: new Date(Date.now() + 900_000).toISOString(),
  refreshToken: 'refresh-1',
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  userId: 'u1',
  email: 'a@b.com',
};

const proof = {
  apple_id_token: 'idt',
  apple_authorization_code: 'code',
  apple_redirect_uri: 'https://dashboard.example.com/api/auth/apple/callback',
};

beforeEach(() => {
  jest.resetAllMocks();
  mockedRefresh.mockResolvedValue({ status: 'active', session });
  mockedFetch.mockResolvedValue(null);
});

describe('deleteAccount', () => {
  it('deletes the account with the access token and clears the local session', async () => {
    await expect(deleteAccount()).resolves.toEqual({ ok: true });

    expect(mockedFetch).toHaveBeenCalledWith('/auth/me', { method: 'DELETE', token: 'access-1', body: undefined });
    expect(mockedDeleteCookie).toHaveBeenCalledTimes(1);
  });

  it('sends the Apple proof in the body', async () => {
    await expect(deleteAccount(proof)).resolves.toEqual({ ok: true });

    expect(mockedFetch).toHaveBeenCalledWith('/auth/me', { method: 'DELETE', token: 'access-1', body: proof });
  });

  it('keeps the local session when the API refuses', async () => {
    mockedFetch.mockRejectedValue(new BackendError('has data', 409));

    await expect(deleteAccount()).resolves.toEqual({ ok: false, errorCode: 'has_data' });
    expect(mockedDeleteCookie).not.toHaveBeenCalled();
  });

  it('counts an account that is already gone as deleted', async () => {
    mockedFetch.mockRejectedValue(new BackendError('not found', 404));

    await expect(deleteAccount()).resolves.toEqual({ ok: true });
    expect(mockedDeleteCookie).toHaveBeenCalledTimes(1);
  });

  it('fails without calling the API when there is no session', async () => {
    mockedRefresh.mockResolvedValue({ status: 'none' });

    await expect(deleteAccount()).resolves.toEqual({ ok: false, errorCode: 'session_expired' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('fails without calling the API when the session cannot be refreshed and its token has expired', async () => {
    mockedRefresh.mockResolvedValue({ status: 'unavailable', session, retryAfterMs: 30_000 });
    mockedValid.mockReturnValue(false);

    await expect(deleteAccount()).resolves.toEqual({ ok: false, errorCode: 'unavailable' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('still deletes with a token that is valid while the refresh is unavailable', async () => {
    mockedRefresh.mockResolvedValue({ status: 'unavailable', session, retryAfterMs: 30_000 });
    mockedValid.mockReturnValue(true);

    await expect(deleteAccount()).resolves.toEqual({ ok: true });
  });
});

describe('mapDeleteAccountError', () => {
  it.each([
    [409, false, 'has_data'],
    [422, false, 'apple_required'],
    [403, true, 'apple_mismatch'],
    [401, false, 'session_expired'],
    [401, true, 'apple_failed'],
    [400, true, 'apple_failed'],
    [400, false, 'unknown'],
    [502, true, 'apple_failed'],
    [503, false, 'unavailable'],
    [500, false, 'unavailable'],
    [418, false, 'unknown'],
  ])('maps %i (Apple proof sent: %s) to %s', (status, withProof, expected) => {
    expect(mapDeleteAccountError(new BackendError('x', status), withProof)).toBe(expected);
  });

  it('treats a failure that is not an API answer (network, timeout) as the service being unavailable', () => {
    expect(mapDeleteAccountError(new TypeError('fetch failed'), false)).toBe('unavailable');
  });
});
