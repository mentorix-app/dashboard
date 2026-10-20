export const AUTH_ERROR_CODES = [
  'invalid_token',
  'rate_limited',
  'unavailable',
  'session_failed',
  'apple_cancelled',
  'apple_failed',
  'unknown',
] as const;

/**
 * Why deleting the account failed. `apple_required` is not an error for the person:
 * it sends them through Sign in with Apple, which the API demands before it deletes an account with an Apple sign-in.
 */
export const DELETE_ACCOUNT_ERROR_CODES = [
  'has_data',
  'apple_required',
  'apple_mismatch',
  'apple_failed',
  'apple_cancelled',
  'session_expired',
  'unavailable',
  'unknown',
] as const;

/** Where the browser goes to confirm the deletion with Apple (see `app/api/auth/apple/start`). */
export const APPLE_ACCOUNT_DELETION_START_PATH = '/api/auth/apple/start?intent=delete';
