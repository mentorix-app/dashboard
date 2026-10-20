jest.mock('server-only', () => ({}));

jest.mock('../backend', () => {
  const actual = jest.requireActual('../backend');
  return { ...actual, backendFetch: jest.fn() };
});

jest.mock('../clientAddress', () => ({ getClientAddress: jest.fn() }));

jest.mock('../session.cookies', () => ({
  getSession: jest.fn(),
  writeSessionCookie: jest.fn(),
  deleteSessionCookie: jest.fn(),
}));

import { BackendError, backendFetch } from '../backend';
import { getClientAddress } from '../clientAddress';
import { deleteSessionCookie, getSession, writeSessionCookie } from '../session.cookies';
import { forceRefresh, refreshSessionIfNeeded } from '../session.refresh';
import type { AuthSession, LoginResponse } from '../session.types';

const mockedFetch = backendFetch as jest.MockedFunction<typeof backendFetch>;
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockedWrite = writeSessionCookie as jest.MockedFunction<typeof writeSessionCookie>;
const mockedDelete = deleteSessionCookie as jest.MockedFunction<typeof deleteSessionCookie>;
const mockedAddress = getClientAddress as jest.MockedFunction<typeof getClientAddress>;

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

const REFRESH_EXPIRES_AT = '2026-11-19T10:00:00Z';

const okResponse: LoginResponse = {
  access_token: 'access-new',
  token_type: 'bearer',
  expires_at: new Date(Date.now() + 900_000).toISOString(),
  refresh_expires_at: REFRESH_EXPIRES_AT,
  refresh_token: 'refresh-new',
  user_id: 'u1',
  email: 'a@b.com',
};

const activeToken = (state: Awaited<ReturnType<typeof refreshSessionIfNeeded>>): string | undefined =>
  state.status === 'active' ? state.session.accessToken : undefined;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockedAddress.mockResolvedValue('203.0.113.7');
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('refreshSessionIfNeeded - single-flight', () => {
  it('dedupes concurrent refreshes into one backend call', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-concurrent'));
    mockedFetch.mockResolvedValue(okResponse);

    const results = await Promise.all([refreshSessionIfNeeded(), refreshSessionIfNeeded(), refreshSessionIfNeeded()]);

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    for (const result of results) {
      expect(activeToken(result)).toBe('access-new');
    }
    // Every request re-affirms the rotated session on its own response.
    expect(mockedWrite).toHaveBeenCalledTimes(3);
  });

  it('reuses the rotated outcome for a late request still holding the old token', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-grace'));
    mockedFetch.mockResolvedValue(okResponse);

    await refreshSessionIfNeeded();
    const late = await refreshSessionIfNeeded();

    // The grace cache serves the late call without a second backend refresh.
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(activeToken(late)).toBe('access-new');
  });

  it('does not refresh when the access token is still fresh', async () => {
    mockedGetSession.mockResolvedValue({
      ...staleSession('refresh-fresh'),
      accessExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    });

    const result = await refreshSessionIfNeeded();

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(activeToken(result)).toBe('access-old');
  });

  it('returns none without calling the backend when there is no session', async () => {
    mockedGetSession.mockResolvedValue(null);

    await expect(refreshSessionIfNeeded()).resolves.toEqual({ status: 'none' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});

describe('refresh request and response', () => {
  it('sends the refresh token in the body together with the browser address', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-body'));
    mockedFetch.mockResolvedValue(okResponse);

    await refreshSessionIfNeeded();

    expect(mockedFetch).toHaveBeenCalledWith('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: 'refresh-body' },
      clientIp: '203.0.113.7',
    });
  });

  it('takes the rotated refresh token and its expiry from the response', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-rotated'));
    mockedFetch.mockResolvedValue(okResponse);

    await refreshSessionIfNeeded();

    expect(mockedWrite).toHaveBeenCalledWith(
      expect.objectContaining({ refreshToken: 'refresh-new', refreshExpiresAt: REFRESH_EXPIRES_AT })
    );
  });

  it('keeps the current refresh token when the response omits a new one', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-kept'));
    mockedFetch.mockResolvedValue({ ...okResponse, refresh_token: undefined });

    await refreshSessionIfNeeded();

    expect(mockedWrite).toHaveBeenCalledWith(expect.objectContaining({ refreshToken: 'refresh-kept' }));
  });
});

describe('refreshSessionIfNeeded - failure handling', () => {
  it('logs out (deletes the session) when the refresh token is rejected with 401', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-401'));
    mockedFetch.mockRejectedValue(new BackendError('invalid or expired refresh token', 401));

    const result = await refreshSessionIfNeeded();

    expect(result).toEqual({ status: 'none' });
    expect(mockedDelete).toHaveBeenCalledTimes(1);
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('keeps the session on a transient error and reports the pause', async () => {
    const session = staleSession('refresh-transient');
    mockedGetSession.mockResolvedValue(session);
    mockedFetch.mockRejectedValue(new BackendError('upstream down', 503));

    const result = await refreshSessionIfNeeded();

    expect(result).toEqual({ status: 'unavailable', session, retryAfterMs: 30_000 });
    expect(mockedDelete).not.toHaveBeenCalled();
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('treats a network error like a transient failure', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-network'));
    mockedFetch.mockRejectedValue(new TypeError('fetch failed'));

    await expect(refreshSessionIfNeeded()).resolves.toMatchObject({ status: 'unavailable', retryAfterMs: 30_000 });
  });

  it('does not call the backend again during the cooldown, then retries once it is over', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-cooldown'));
    mockedFetch.mockRejectedValueOnce(new BackendError('upstream down', 503)).mockResolvedValueOnce(okResponse);

    await refreshSessionIfNeeded();
    const during = await refreshSessionIfNeeded();
    expect(during.status).toBe('unavailable');
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(30_001);

    const after = await refreshSessionIfNeeded();
    expect(activeToken(after)).toBe('access-new');
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });
});

describe('refreshSessionIfNeeded - rate limit', () => {
  const rateLimited = (retryAfterMs?: number) => new BackendError('too many requests', 429, retryAfterMs);

  it('pauses for the Retry-After the API sent', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-429-header'));
    mockedFetch.mockRejectedValue(rateLimited(90_000));

    await expect(refreshSessionIfNeeded()).resolves.toMatchObject({ status: 'unavailable', retryAfterMs: 90_000 });
  });

  it('pauses for five minutes when there is no Retry-After', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-429-default'));
    mockedFetch.mockRejectedValue(rateLimited());

    await expect(refreshSessionIfNeeded()).resolves.toMatchObject({ status: 'unavailable', retryAfterMs: 300_000 });
  });

  it('never pauses for less than a second', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-429-zero'));
    mockedFetch.mockRejectedValue(rateLimited(0));

    await expect(refreshSessionIfNeeded()).resolves.toMatchObject({ status: 'unavailable', retryAfterMs: 1_000 });
  });

  it('caps an unreasonably long Retry-After at one hour', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-429-huge'));
    mockedFetch.mockRejectedValue(rateLimited(24 * 3_600_000));

    await expect(refreshSessionIfNeeded()).resolves.toMatchObject({ status: 'unavailable', retryAfterMs: 3_600_000 });
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
    expect(activeToken(result)).toBe('access-new');
  });

  it('returns none when there is no session', async () => {
    mockedGetSession.mockResolvedValue(null);

    await expect(forceRefresh()).resolves.toEqual({ status: 'none' });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('reports a transient failure without touching the cookie', async () => {
    mockedGetSession.mockResolvedValue(staleSession('refresh-force-down'));
    mockedFetch.mockRejectedValue(new BackendError('upstream down', 502));

    await expect(forceRefresh()).resolves.toMatchObject({ status: 'unavailable' });
    expect(mockedDelete).not.toHaveBeenCalled();
  });
});
