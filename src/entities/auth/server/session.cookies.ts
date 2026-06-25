import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { AUTH_SESSION_COOKIE } from '@/src/shared/api';

import { decryptSession, encryptSession } from './session.crypto';
import type { AuthSession } from './session.types';

export const writeSessionCookie = async (session: AuthSession): Promise<void> => {
  const value = await encryptSession(session);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.refreshExpiresAt),
  });
};

export const deleteSessionCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE);
};

export const getSession = cache(async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!value) return null;
  return decryptSession(value);
});

export const requireSession = async (): Promise<AuthSession> => {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
};
