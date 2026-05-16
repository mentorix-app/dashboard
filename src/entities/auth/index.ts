// Client-safe barrel. Server-only helpers (getSession, requireSession, etc.)
// must be imported directly from '@/src/entities/auth/server/dal'.
export { loginAction, signupAction, logoutAction } from './server/actions';
export type { AuthCredentials, AuthActionResult } from './server/actions';
