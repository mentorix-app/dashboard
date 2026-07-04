'use server';

import { redirect } from 'next/navigation';
import { REFRESH_COOKIE_NAME } from '@/src/shared/api';
import { ROUTES } from '@/src/shared/lib';
import { backendFetch, backendFetchRaw, parseRefreshCookie, BackendError } from './backend';
import {
  getSession,
  mapResponseToSession,
  writeSessionCookie,
  deleteSessionCookie,
  type LoginResponse,
} from './session';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupInput = AuthCredentials & {
  name: string;
};

export type AuthActionResult = { error: string } | undefined;

const INVALID_CREDENTIALS = 'Invalid email or password.';
const GENERIC_ERROR = 'Something went wrong. Please try again.';
const SESSION_ERROR = 'Could not establish a session. Please try signing in.';

const validateCredentials = (input: unknown): AuthCredentials | null => {
  if (typeof input !== 'object' || input === null) return null;
  const obj = input as Record<string, unknown>;
  if (typeof obj.email !== 'string' || typeof obj.password !== 'string') return null;
  if (obj.email.trim().length === 0 || obj.password.length === 0) return null;
  return { email: obj.email.trim(), password: obj.password };
};

const validateSignupInput = (input: unknown): SignupInput | null => {
  const credentials = validateCredentials(input);
  if (!credentials) return null;
  const obj = input as Record<string, unknown>;
  if (typeof obj.name !== 'string' || obj.name.trim().length === 0) return null;
  return { ...credentials, name: obj.name.trim() };
};

/**
 * Persists the encrypted, HttpOnly session from a backend auth response.
 * Returns `false` when the backend did not issue a refresh cookie.
 */
const persistSession = async (data: LoginResponse, setCookie: string[]): Promise<boolean> => {
  const refresh = parseRefreshCookie(setCookie);
  if (!refresh) return false;
  await writeSessionCookie(mapResponseToSession(data, refresh.token, refresh.expiresAt));
  return true;
};

/**
 * Authenticates against the backend and persists an encrypted, HttpOnly
 * session cookie holding both the access and refresh tokens. Redirects to the
 * dashboard on success.
 */
export async function loginAction(input: AuthCredentials): Promise<AuthActionResult> {
  const credentials = validateCredentials(input);
  if (!credentials) return { error: INVALID_CREDENTIALS };

  try {
    const { data, setCookie } = await backendFetchRaw<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    if (!(await persistSession(data, setCookie))) return { error: SESSION_ERROR };
  } catch (err) {
    if (err instanceof BackendError) {
      return { error: err.status === 401 ? INVALID_CREDENTIALS : err.message || GENERIC_ERROR };
    }
    return { error: GENERIC_ERROR };
  }

  redirect(ROUTES.dashboard);
}

/**
 * Registers a new user account. The backend returns tokens and a refresh
 * cookie on registration, so the user is logged in immediately and redirected
 * to the dashboard.
 */
export async function signupAction(input: SignupInput): Promise<AuthActionResult> {
  const credentials = validateSignupInput(input);
  if (!credentials) return { error: GENERIC_ERROR };

  try {
    const { data, setCookie } = await backendFetchRaw<LoginResponse>('/auth/register', {
      method: 'POST',
      body: credentials,
    });
    if (!(await persistSession(data, setCookie))) return { error: SESSION_ERROR };
  } catch (err) {
    if (err instanceof BackendError) return { error: err.message || GENERIC_ERROR };
    return { error: GENERIC_ERROR };
  }

  redirect(ROUTES.dashboard);
}

/**
 * Revokes the backend refresh session (best-effort), clears the local session
 * cookie, and redirects to the login page.
 */
export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) {
    try {
      await backendFetch('/auth/logout', {
        method: 'POST',
        cookie: `${REFRESH_COOKIE_NAME}=${session.refreshToken}`,
      });
    } catch {
      // Ignore backend errors — the local session is cleared regardless.
    }
  }

  await deleteSessionCookie();
  redirect(ROUTES.login);
}
