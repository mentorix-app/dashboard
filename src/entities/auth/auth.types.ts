import type { AUTH_ERROR_CODES, DELETE_ACCOUNT_ERROR_CODES } from './auth.constants';

/** Why a sign-in failed. The UI maps each code to a translated message. */
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

export type AuthFailure = {
  errorCode: AuthErrorCode;
  /** Whole seconds until a rate-limited request may be retried, when the API said so. */
  retryAfterSeconds?: number;
};

/** Result of a sign-in server action: `undefined` on success (the action redirects). */
export type AuthActionResult = AuthFailure | undefined;

export type DeleteAccountErrorCode = (typeof DELETE_ACCOUNT_ERROR_CODES)[number];

export type DeleteAccountFailure = {
  errorCode: DeleteAccountErrorCode;
};

/** Result of the delete-account server action: `undefined` once the account is gone. */
export type DeleteAccountActionResult = DeleteAccountFailure | undefined;
