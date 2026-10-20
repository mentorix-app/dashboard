// Client-safe barrel. Server-only helpers (getSession, requireSession, etc.)
// must be imported directly from '@/src/entities/auth/server/dal'.
export { deleteAccountAction, googleSignInAction, logoutAction, prepareGoogleSignInAction } from './server/actions';
export { APPLE_ACCOUNT_DELETION_START_PATH, AUTH_ERROR_CODES, DELETE_ACCOUNT_ERROR_CODES } from './auth.constants';
export { isAuthErrorCode, isDeleteAccountErrorCode } from './auth.utils';
export { AuthErrorAlert } from './ui/AuthErrorAlert';
export type {
  AuthActionResult,
  AuthErrorCode,
  AuthFailure,
  DeleteAccountActionResult,
  DeleteAccountErrorCode,
  DeleteAccountFailure,
} from './auth.types';
