import 'server-only';

import { REFRESH_BUFFER_MS } from '@/src/shared/api';
import { backendFetch } from './backend';
import { deleteSessionCookie, getSession, writeSessionCookie } from './session.cookies';
import { mapResponseToSession, type AuthSession, type LoginResponse } from './session.types';

let pendingRefresh: Promise<AuthSession | null> | null = null;

const performRefresh = async (current: AuthSession): Promise<AuthSession | null> => {
  try {
    const raw = await backendFetch<LoginResponse>('/auth/refresh', {
      method: 'POST',
      token: current.accessToken,
    });
    const next = mapResponseToSession(raw);
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

  const expiresAt = new Date(session.expiresAt).getTime();
  const isStale = Date.now() >= expiresAt - REFRESH_BUFFER_MS;
  if (!isStale) return session;

  if (!pendingRefresh) {
    pendingRefresh = performRefresh(session).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
};
