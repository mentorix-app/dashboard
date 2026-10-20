import 'server-only';

import type { DeleteAccountErrorCode, DeleteAccountFailure } from '../auth.types';
import { BackendError, backendFetch } from './backend';
import { deleteSessionCookie, isAccessTokenValid, refreshSessionIfNeeded } from './session';

/** What the API wants from an account that signs in with Apple: a fresh authorization, right before the call. */
export type AppleDeletionProof = {
  apple_id_token: string;
  apple_authorization_code: string;
  apple_redirect_uri: string;
};

export type DeleteAccountResult = { ok: true } | ({ ok: false } & DeleteAccountFailure);

/** Maps a failed `DELETE /auth/me` to the code the UI translates. */
export const mapDeleteAccountError = (error: unknown, withAppleProof: boolean): DeleteAccountErrorCode => {
  // Not an answer from the API at all: the network or a timeout.
  if (!(error instanceof BackendError)) return 'unavailable';

  switch (error.status) {
    case 409:
      return 'has_data';
    case 422:
      return 'apple_required';
    case 403:
      return 'apple_mismatch';
    case 401:
      return withAppleProof ? 'apple_failed' : 'session_expired';
    case 400:
      return withAppleProof ? 'apple_failed' : 'unknown';
    case 502:
      return 'apple_failed';
    default:
      return error.status >= 500 ? 'unavailable' : 'unknown';
  }
};

/**
 * Deletes the signed-in account and, once the API confirmed it, the local session.
 * Without a proof an account with an Apple sign-in answers `apple_required`; the caller
 * then runs Sign in with Apple and calls this again with the result.
 */
export const deleteAccount = async (proof?: AppleDeletionProof): Promise<DeleteAccountResult> => {
  const state = await refreshSessionIfNeeded();
  if (state.status === 'none') return { ok: false, errorCode: 'session_expired' };
  if (state.status === 'unavailable' && !isAccessTokenValid(state.session)) {
    return { ok: false, errorCode: 'unavailable' };
  }

  try {
    await backendFetch('/auth/me', { method: 'DELETE', token: state.session.accessToken, body: proof });
  } catch (error) {
    // The account is already gone: nothing left to delete, only the session to drop.
    if (!(error instanceof BackendError && error.status === 404)) {
      return { ok: false, errorCode: mapDeleteAccountError(error, proof !== undefined) };
    }
  }

  await deleteSessionCookie();
  return { ok: true };
};
