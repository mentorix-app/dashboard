'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/src/shared/lib';
import type { AuthActionResult, DeleteAccountActionResult } from '../auth.types';
import { backendFetch } from './backend';
import { deleteAccount } from './deleteAccount';
import { GOOGLE_NONCE_COOKIE, OAUTH_COOKIE_MAX_AGE_SECONDS } from './oauth.constants';
import { generateOAuthValue, hashNonce } from './nonce.utils';
import { deleteSessionCookie, getSession } from './session';
import { signInWithProvider } from './signIn';

/**
 * Starts a Google sign-in: creates a raw nonce, keeps it in a short-lived
 * HttpOnly cookie and returns its hash for Google Identity Services. The raw
 * value goes to the API when the credential comes back.
 */
export async function prepareGoogleSignInAction(): Promise<{ nonce: string }> {
  const raw = generateOAuthValue();
  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_NONCE_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
  });
  return { nonce: hashNonce(raw) };
}

/**
 * Signs in with the Google ID token (credential) returned by Google Identity
 * Services, then redirects to the dashboard. Returns the failure code otherwise.
 */
export async function googleSignInAction(idToken: string): Promise<AuthActionResult> {
  if (typeof idToken !== 'string' || idToken.length === 0) return { errorCode: 'invalid_token' };

  const cookieStore = await cookies();
  const nonce = cookieStore.get(GOOGLE_NONCE_COOKIE)?.value;
  // A nonce is single-use: whatever the outcome, the next attempt gets a new one.
  cookieStore.delete(GOOGLE_NONCE_COOKIE);

  const result = await signInWithProvider('google', { id_token: idToken, ...(nonce ? { nonce } : {}) });
  if (!result.ok) {
    return { errorCode: result.errorCode, retryAfterSeconds: result.retryAfterSeconds };
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
        body: { refresh_token: session.refreshToken },
      });
    } catch {
      // Ignore backend errors — the local session is cleared regardless.
    }
  }

  await deleteSessionCookie();
  redirect(ROUTES.login);
}

/**
 * Deletes the signed-in account. Returns `undefined` once it is gone (the session
 * is cleared; the caller leaves the page), otherwise the reason it was not deleted.
 * `apple_required` means the person has to confirm with Apple first.
 */
export async function deleteAccountAction(): Promise<DeleteAccountActionResult> {
  const result = await deleteAccount();
  return result.ok ? undefined : { errorCode: result.errorCode };
}
