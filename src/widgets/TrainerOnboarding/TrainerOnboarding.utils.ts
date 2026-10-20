import type { HttpError } from '@/src/shared/api';
import type { ActivationErrorKey } from './TrainerOnboarding.types';

const readErrorCode = (error: HttpError): string | undefined => {
  const data: unknown = error.cause?.response?.data;
  if (typeof data !== 'object' || data === null) return undefined;
  return 'code' in data && typeof data.code === 'string' ? data.code : undefined;
};

/** Maps a failed `POST /auth/me/trainer` to the message the person sees. */
export const getActivationErrorKey = (error: HttpError): ActivationErrorKey => {
  const code = readErrorCode(error);
  if (code === 'admin_cannot_activate') return 'admin';
  if (code === 'user_not_found' || error.status === 404) return 'notFound';
  if (error.status === 429) return 'rateLimited';
  // No status means the request never reached the server.
  if (error.status === undefined || error.status >= 500) return 'unavailable';
  return 'unknown';
};
