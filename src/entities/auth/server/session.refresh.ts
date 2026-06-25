import 'server-only';

import { REFRESH_BUFFER_MS, REFRESH_COOKIE_NAME } from '@/src/shared/api';
import { backendFetchRaw, parseRefreshCookie } from './backend';
import { deleteSessionCookie, getSession, writeSessionCookie } from './session.cookies';
import { mapResponseToSession, type AuthSession, type LoginResponse } from './session.types';

let pendingRefresh: Promise<AuthSession | null> | null = null;

const performRefresh = async (current: AuthSession): Promise<AuthSession | null> => {
  try {
    const { data, setCookie } = await backendFetchRaw<LoginResponse>('/auth/refresh', {
      method: 'POST',
      cookie: `${REFRESH_COOKIE_NAME}=${current.refreshToken}`,
    });

    // The backend rotates the refresh token on every refresh; reuse the
    // previous one only if the response omits a fresh Set-Cookie.
    const rotated = parseRefreshCookie(setCookie);
    const refreshToken = rotated?.token ?? current.refreshToken;
    const refreshExpiresAt = rotated?.expiresAt ?? current.refreshExpiresAt;

    const next = mapResponseToSession(data, refreshToken, refreshExpiresAt);
    await writeSessionCookie(next);
    return next;
  } catch {
    await deleteSessionCookie();
    return null;
  }
};

export const refreshSessionIfNeeded = async (): Promise<AuthSession | null> => {
  const session = await getSession();
  if (!session) return null;

  const expiresAt = new Date(session.accessExpiresAt).getTime();
  const isStale = Date.now() >= expiresAt - REFRESH_BUFFER_MS;
  if (!isStale) return session;

  if (!pendingRefresh) {
    pendingRefresh = performRefresh(session).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
};
