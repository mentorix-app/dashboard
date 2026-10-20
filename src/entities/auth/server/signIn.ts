import 'server-only';

import type { AuthFailure } from '../auth.types';
import { BackendError, backendFetch } from './backend';
import { getClientAddress } from './clientAddress';
import { mapResponseToSession, type LoginResponse } from './session.types';
import { writeSessionCookie } from './session.cookies';

export type SignInProvider = 'google' | 'apple';

export type SignInResult = { ok: true } | ({ ok: false } & AuthFailure);

/** Maps a failed backend call to the code the UI translates. */
export const mapAuthError = (error: unknown): AuthFailure => {
  if (!(error instanceof BackendError)) return { errorCode: 'unknown' };
  if (error.status === 401) return { errorCode: 'invalid_token' };
  if (error.status === 429) {
    return {
      errorCode: 'rate_limited',
      ...(error.retryAfterMs === undefined
        ? {}
        : { retryAfterSeconds: Math.max(1, Math.ceil(error.retryAfterMs / 1_000)) }),
    };
  }
  if (error.status >= 500) return { errorCode: 'unavailable' };
  return { errorCode: 'unknown' };
};

/**
 * Exchanges a provider ID token for a Mentorix session and stores it in the
 * encrypted cookie. The API creates the account on the first sign-in.
 */
export const signInWithProvider = async (
  provider: SignInProvider,
  body: { id_token: string; nonce?: string; name?: string }
): Promise<SignInResult> => {
  try {
    const data = await backendFetch<LoginResponse>(`/auth/${provider}`, {
      method: 'POST',
      body,
      clientIp: await getClientAddress(),
    });
    // The dashboard keeps the refresh token in its own session, so a response without one is unusable.
    if (!data.refresh_token) return { ok: false, errorCode: 'session_failed' };
    await writeSessionCookie(mapResponseToSession(data, data.refresh_token));
    return { ok: true };
  } catch (error) {
    return { ok: false, ...mapAuthError(error) };
  }
};
