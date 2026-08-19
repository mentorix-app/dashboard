import { HttpError } from '@/src/shared/api';

export type ProgramBlockErrorKey =
  | 'noSharedBlock'
  | 'clientNotAssigned'
  | 'clientListRequired'
  | 'visibilityMismatch'
  | 'forbidden'
  | 'notFound'
  | 'unknown';

export const parseProgramBlockError = (error: unknown): ProgramBlockErrorKey => {
  if (!(error instanceof HttpError)) return 'unknown';
  if (error.status === 403) return 'forbidden';
  if (error.status === 404) return 'notFound';
  if (error.status !== 400 && error.status !== 422) return 'unknown';

  if (
    error.message.startsWith('day would have no shared block:') ||
    /week \d+ day \d+ has no shared block/.test(error.message)
  ) {
    return 'noSharedBlock';
  }
  if (error.message.startsWith('client is not assigned to this program:')) return 'clientNotAssigned';
  if (error.message === 'client_user_ids is required') return 'clientListRequired';
  if (error.message === 'blocks to merge must have the same client list') return 'visibilityMismatch';
  return 'unknown';
};
