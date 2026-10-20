import 'server-only';

import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  APPLE_AUTHORIZE_URL,
  APPLE_CALLBACK_PATH,
  APPLE_COOKIE_PATH,
  APPLE_DELETION_PATH,
  APPLE_DELETION_PROOF_COOKIE,
  APPLE_DELETION_PROOF_MAX_AGE_SECONDS,
  APPLE_INTENT_COOKIE,
  APPLE_NONCE_COOKIE,
  APPLE_STATE_COOKIE,
  DEFAULT_APPLE_SERVICE_ID,
  OAUTH_COOKIE_MAX_AGE_SECONDS,
} from './oauth.constants';
import { deleteAccount, type AppleDeletionProof, type DeleteAccountResult } from './deleteAccount';
import { generateOAuthValue, hashNonce } from './nonce.utils';
import { signInWithProvider, type SignInResult } from './signIn';

type CookieStore = Awaited<ReturnType<typeof cookies>>;

/** What a round trip to Apple is for: signing in, or a fresh authorization to delete the account. */
export type AppleIntent = 'signin' | 'delete';

// Apple answers with a cross-site form POST, which browsers only send
// cookies on when they are `SameSite=None` (and therefore `Secure`).
const appleCookie = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: APPLE_COOKIE_PATH,
  maxAge,
});

const setAppleCookie = (store: CookieStore, name: string, value: string): void => {
  store.set(name, value, appleCookie(OAUTH_COOKIE_MAX_AGE_SECONDS));
};

const clearAppleCookie = (store: CookieStore, name: string): void => {
  store.set(name, '', appleCookie(0));
};

/** Public origin of the dashboard; must match the host of the Return URL registered at Apple. */
export const resolveAppOrigin = (fallback: string): string =>
  (process.env.NEXT_PUBLIC_APP_URL?.trim() || fallback).replace(/\/$/, '');

const appleRedirectUri = (originFallback: string): string =>
  `${resolveAppOrigin(originFallback)}${APPLE_CALLBACK_PATH}`;

/**
 * Starts Sign in with Apple: remembers a fresh `state`, a raw nonce and what the
 * round trip is for in short-lived cookies and returns the Apple authorization URL to redirect to.
 */
export const startAppleSignIn = async (originFallback: string, intent: AppleIntent = 'signin'): Promise<string> => {
  const state = generateOAuthValue();
  const nonce = generateOAuthValue();

  const store = await cookies();
  setAppleCookie(store, APPLE_STATE_COOKIE, state);
  setAppleCookie(store, APPLE_NONCE_COOKIE, nonce);
  setAppleCookie(store, APPLE_INTENT_COOKIE, intent);

  const params = new URLSearchParams({
    client_id: process.env.APPLE_SERVICE_ID?.trim() || DEFAULT_APPLE_SERVICE_ID,
    redirect_uri: appleRedirectUri(originFallback),
    response_type: 'code id_token',
    response_mode: 'form_post',
    scope: 'name email',
    state,
    nonce: hashNonce(nonce),
  });
  // Apple reads the query as `application/x-www-form-urlencoded`, but `%20` is the safe spelling of a space.
  return `${APPLE_AUTHORIZE_URL}?${params.toString().replaceAll('+', '%20')}`;
};

/** What the Apple round trip that is coming back was started for. Single-use, like the other Apple cookies. */
export const takeAppleIntent = async (): Promise<AppleIntent> => {
  const store = await cookies();
  const intent = store.get(APPLE_INTENT_COOKIE)?.value;
  clearAppleCookie(store, APPLE_INTENT_COOKIE);
  return intent === 'delete' ? 'delete' : 'signin';
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const safeEqual = (a: string, b: string): boolean => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

/** Apple sends the name only on the very first authorization, as a JSON string in the `user` field. */
export const readAppleName = (value: FormDataEntryValue | null): string | undefined => {
  if (typeof value !== 'string' || value === '') return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !isRecord(parsed.name)) return undefined;
    const { firstName, lastName } = parsed.name;
    const name = [firstName, lastName]
      .filter((part): part is string => typeof part === 'string' && part.trim() !== '')
      .map((part) => part.trim())
      .join(' ');
    return name === '' ? undefined : name;
  } catch {
    return undefined;
  }
};

type AppleAnswer =
  | { ok: true; idToken: string; code?: string; nonce: string }
  | { ok: false; errorCode: 'apple_cancelled' | 'apple_failed' };

/**
 * Checks the form Apple posts to the Return URL: the `state` must be the one this
 * browser started with, and the ID token must be there. Both cookies are single-use.
 */
const readAppleAnswer = async (form: FormData): Promise<AppleAnswer> => {
  const store = await cookies();
  const expectedState = store.get(APPLE_STATE_COOKIE)?.value;
  const nonce = store.get(APPLE_NONCE_COOKIE)?.value;
  // Both values are single-use, whatever the outcome.
  clearAppleCookie(store, APPLE_STATE_COOKIE);
  clearAppleCookie(store, APPLE_NONCE_COOKIE);

  const error = form.get('error');
  if (typeof error === 'string' && error !== '') {
    return { ok: false, errorCode: error === 'user_cancelled_authorize' ? 'apple_cancelled' : 'apple_failed' };
  }

  const state = form.get('state');
  const idToken = form.get('id_token');
  if (!expectedState || !nonce || typeof state !== 'string' || !safeEqual(state, expectedState)) {
    return { ok: false, errorCode: 'apple_failed' };
  }
  if (typeof idToken !== 'string' || idToken === '') {
    return { ok: false, errorCode: 'apple_failed' };
  }

  const code = form.get('code');
  return { ok: true, idToken, nonce, ...(typeof code === 'string' && code !== '' ? { code } : {}) };
};

/**
 * Handles the form Apple posts to the Return URL: checks `state`, then signs in
 * with the returned ID token and the raw nonce kept in the cookie.
 */
export const completeAppleSignIn = async (form: FormData): Promise<SignInResult> => {
  const answer = await readAppleAnswer(form);
  if (!answer.ok) return answer;

  const name = readAppleName(form.get('user'));
  return signInWithProvider('apple', { id_token: answer.idToken, nonce: answer.nonce, ...(name ? { name } : {}) });
};

/**
 * First half of deleting an account that signs in with Apple. The answer arrives in a
 * cross-site POST that carries no session cookie, so the check happens here and the proof
 * (ID token and authorization code) waits in a short-lived cookie for `completeAppleAccountDeletion`.
 */
export const acceptAppleDeletionProof = async (
  form: FormData
): Promise<{ ok: true } | { ok: false; errorCode: 'apple_cancelled' | 'apple_failed' }> => {
  const answer = await readAppleAnswer(form);
  if (!answer.ok) return answer;
  if (!answer.code) return { ok: false, errorCode: 'apple_failed' };

  const store = await cookies();
  store.set(APPLE_DELETION_PROOF_COOKIE, JSON.stringify({ idToken: answer.idToken, code: answer.code }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: APPLE_DELETION_PATH,
    maxAge: APPLE_DELETION_PROOF_MAX_AGE_SECONDS,
  });
  return { ok: true };
};

const readDeletionProof = (value: string | undefined): { idToken: string; code: string } | null => {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return null;
    const { idToken, code } = parsed;
    return typeof idToken === 'string' && typeof code === 'string' && idToken !== '' && code !== ''
      ? { idToken, code }
      : null;
  } catch {
    return null;
  }
};

/** Second half: deletes the account with the proof `acceptAppleDeletionProof` left, now that the session cookie is visible. */
export const completeAppleAccountDeletion = async (originFallback: string): Promise<DeleteAccountResult> => {
  const store = await cookies();
  const proof = readDeletionProof(store.get(APPLE_DELETION_PROOF_COOKIE)?.value);
  // Single-use: the authorization code is spent by the first call, whatever its outcome.
  store.set(APPLE_DELETION_PROOF_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: APPLE_DELETION_PATH,
    maxAge: 0,
  });
  if (!proof) return { ok: false, errorCode: 'apple_failed' };

  const appleProof: AppleDeletionProof = {
    apple_id_token: proof.idToken,
    apple_authorization_code: proof.code,
    apple_redirect_uri: appleRedirectUri(originFallback),
  };
  return deleteAccount(appleProof);
};
