import { HttpError } from '@/src/shared/api';

import { parseProgramBlockError } from './parseProgramBlockError';

const buildHttpError = (status: number, message: string): HttpError => {
  const error = new HttpError(message);
  Object.defineProperty(error, 'status', { value: status });
  return error;
};

describe('parseProgramBlockError', () => {
  it.each([
    ['day would have no shared block: day-1', 'noSharedBlock'],
    ['week 2 day 3 has no shared block', 'noSharedBlock'],
    ['client is not assigned to this program: client-1', 'clientNotAssigned'],
    ['client_user_ids is required', 'clientListRequired'],
    ['blocks to merge must have the same client list', 'visibilityMismatch'],
  ])('maps backend validation message %s', (message, expected) => {
    expect(parseProgramBlockError(buildHttpError(400, message))).toBe(expected);
  });

  it('maps permission and missing-resource statuses', () => {
    expect(parseProgramBlockError(buildHttpError(403, 'denied'))).toBe('forbidden');
    expect(parseProgramBlockError(buildHttpError(404, 'missing'))).toBe('notFound');
  });

  it('uses the unknown fallback for unrelated errors', () => {
    expect(parseProgramBlockError(new Error('boom'))).toBe('unknown');
    expect(parseProgramBlockError(buildHttpError(500, 'boom'))).toBe('unknown');
  });
});
