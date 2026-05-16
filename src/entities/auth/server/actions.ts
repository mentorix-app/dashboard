'use server';

import { redirect } from 'next/navigation';

import { ROUTES } from '@/src/shared/lib';
import { backendFetch, BackendError } from './backend';
import { mapResponseToSession, writeSessionCookie, deleteSessionCookie, type LoginResponse } from './session';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthActionResult = { error: string } | undefined;

const INVALID_CREDENTIALS = 'Invalid email or password.';
const GENERIC_ERROR = 'Something went wrong. Please try again.';

const validateCredentials = (input: unknown): AuthCredentials | null => {
  if (typeof input !== 'object' || input === null) return null;
  const obj = input as Record<string, unknown>;
  if (typeof obj.email !== 'string' || typeof obj.password !== 'string') return null;
  if (obj.email.trim().length === 0 || obj.password.length === 0) return null;
  return { email: obj.email.trim(), password: obj.password };
};

/**
 * Authenticates against the backend and persists an encrypted, HttpOnly
 * session cookie. Redirects to the dashboard on success.
 */
export async function loginAction(input: AuthCredentials): Promise<AuthActionResult> {
  const credentials = validateCredentials(input);
  if (!credentials) return { error: INVALID_CREDENTIALS };

  try {
    const raw = await backendFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    await writeSessionCookie(mapResponseToSession(raw));
  } catch (err) {
    if (err instanceof BackendError) {
      return { error: err.status === 401 ? INVALID_CREDENTIALS : err.message || GENERIC_ERROR };
    }
    return { error: GENERIC_ERROR };
  }

  redirect(ROUTES.dashboard);
}

/**
 * Registers a new user account. Redirects to the login page on success so
 * the user can sign in with the new credentials.
 */
export async function signupAction(input: AuthCredentials): Promise<AuthActionResult> {
  const credentials = validateCredentials(input);
  if (!credentials) return { error: GENERIC_ERROR };

  try {
    await backendFetch('/auth/register', { method: 'POST', body: credentials });
  } catch (err) {
    if (err instanceof BackendError) return { error: err.message || GENERIC_ERROR };
    return { error: GENERIC_ERROR };
  }

  redirect(ROUTES.login);
}

/** Clears the session cookie and redirects to the login page. */
export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect(ROUTES.login);
}
