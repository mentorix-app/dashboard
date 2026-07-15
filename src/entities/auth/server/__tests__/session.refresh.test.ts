jest.mock('server-only', () => ({}));

jest.mock('../backend', () => {
  const actual = jest.requireActual('../backend');
  return { ...actual, backendFetchRaw: jest.fn() };
});

jest.mock('../session.cookies', () => ({
  getSession: jest.fn(),
  writeSessionCookie: jest.fn(),
  deleteSessionCookie: jest.fn(),
}));

import { BackendError, backendFetchRaw } from '../backend';
import { deleteSessionCookie, getSession, writeSessionCookie } from '../session.cookies';
import { forceRefresh, refreshSessionIfNeeded } from '../session.refresh';
import type { AuthSession } from '../session.types';

const mockedFetch = backendFetchRaw as jest.MockedFunction<typeof backendFetchRaw>;
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockedWrite = writeSessionCookie as jest.MockedFunction<typeof writeSessionCookie>;
const mockedDelete = deleteSessionCookie as jest.MockedFunction<typeof deleteSessionCookie>;

let tokenCounterSeed = 0;

/** Builds a session whose access token is already stale so a refresh is due. */
const staleSession = (refreshToken = `refresh-${(tokenCounterSeed += 1)}`): AuthSession => ({
  accessToken: 'access-old',
  accessExpiresAt: new Date(Date.now() - 1_000).toISOString(),
  refreshToken,
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  userId: 'u1',
  email: 'a@b.com',
});

const okResponse = {
  data: {
    access_token: 'access-new',
    token_type: 'bearer',
    expires_at: new Date(Date.now() + 900_000).toISOString(),
    user_id: 'u1',
    email: 'a@b.com',
  },
  setCookie: ['mentorix_refresh=refresh-new; Max-Age=2592000; HttpOnly'],
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('refreshSessionIfNeeded — single-flight', () => {
  it('dedupes concurrent refreshes into one backend call', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-concurrent'));
    mockedFetch.mockResolvedValue(okResponse);

    const results = await Promise.all([refreshSessionIfNeeded(), refreshSessionIfNeeded(), refreshSessionIfNeeded()]);

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    for (const result of results) {
      expect(result?.accessToken).toBe('access-new');
    }
    // Every request re-affirms the rotated cookie on its own response.
    expect(mockedWrite).toHaveBeenCalledTimes(3);
  });

  it('reuses the rotated outcome for a late request still holding the old token', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-grace'));
    mockedFetch.mockResolvedValue(okResponse);

    await refreshSessionIfNeeded();
    const late = await refreshSessionIfNeeded();

    // The grace cache serves the late call without a second backend refresh.
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(late?.accessToken).toBe('access-new');
  });

  it('does not refresh when the access token is still fresh', async () => {
    mockedGetSession.mockResolvedValue({
      ...staleSession('refresh-fresh'),
      accessExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    });

    const result = await refreshSessionIfNeeded();

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(result?.accessToken).toBe('access-old');
  });
});

describe('refreshSessionIfNeeded — failure handling', () => {
  it('logs out (deletes the session) when the refresh token is rejected with 401', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-401'));
    mockedFetch.mockRejectedValue(new BackendError('invalid or expired refresh token', 401));

    const result = await refreshSessionIfNeeded();

    expect(result).toBeNull();
    expect(mockedDelete).toHaveBeenCalledTimes(1);
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('keeps the session on a transient error and retries on the next call', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-transient'));
    mockedFetch.mockRejectedValueOnce(new BackendError('upstream down', 503)).mockResolvedValueOnce(okResponse);

    const first = await refreshSessionIfNeeded();
    expect(first).toBeNull();
    expect(mockedDelete).not.toHaveBeenCalled();

    // Transient outcomes are not cached, so the next request retries.
    const second = await refreshSessionIfNeeded();
    expect(second?.accessToken).toBe('access-new');
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });
});

describe('forceRefresh', () => {
  it('refreshes even when the access token is not yet stale', async () => {
    mockedGetSession.mockResolvedValue({
      ...staleSession('refresh-force'),
      accessExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    });
    mockedFetch.mockResolvedValue(okResponse);

    const result = await forceRefresh();

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(result?.accessToken).toBe('access-new');
  });

  it('returns null when there is no session', async () => {
    mockedGetSession.mockResolvedValue(null);

    const result = await forceRefresh();

    expect(result).toBeNull();
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});
