import type { AxiosError } from 'axios';

import { HttpError } from '@/src/shared/api';
import { PlanCode, QuotaResource } from '@/src/shared/types';

import { parseQuotaError } from '../parseQuotaError';

const buildHttpError = (status: number, data: unknown): HttpError => {
  const cause = { response: { status, data } } as AxiosError;
  return new HttpError('failed', cause);
};

describe('parseQuotaError', () => {
  it('parses a valid 409 quota_exceeded payload', () => {
    const error = buildHttpError(409, {
      error: 'quota_exceeded',
      resource: QuotaResource.Exercises,
      plan: PlanCode.Free,
      limit: 10,
      usage: 10,
    });

    expect(parseQuotaError(error)).toEqual({
      error: 'quota_exceeded',
      resource: QuotaResource.Exercises,
      plan: PlanCode.Free,
      limit: 10,
      usage: 10,
    });
  });

  it('returns null for non-HttpError values', () => {
    expect(parseQuotaError(new Error('nope'))).toBeNull();
    expect(parseQuotaError(null)).toBeNull();
  });

  it('returns null for non-409 statuses', () => {
    const error = buildHttpError(400, { error: 'quota_exceeded' });
    expect(parseQuotaError(error)).toBeNull();
  });

  it('returns null when the body is not a quota error', () => {
    const error = buildHttpError(409, { error: 'something_else' });
    expect(parseQuotaError(error)).toBeNull();
  });

  it('returns null for unknown resource or plan values', () => {
    const badResource = buildHttpError(409, {
      error: 'quota_exceeded',
      resource: 'unknown',
      plan: PlanCode.Free,
      limit: 1,
      usage: 1,
    });
    const badPlan = buildHttpError(409, {
      error: 'quota_exceeded',
      resource: QuotaResource.Exercises,
      plan: 'platinum',
      limit: 1,
      usage: 1,
    });

    expect(parseQuotaError(badResource)).toBeNull();
    expect(parseQuotaError(badPlan)).toBeNull();
  });

  it('returns null when limit or usage are not numbers', () => {
    const error = buildHttpError(409, {
      error: 'quota_exceeded',
      resource: QuotaResource.Exercises,
      plan: PlanCode.Free,
      limit: '10',
      usage: 10,
    });

    expect(parseQuotaError(error)).toBeNull();
  });
});
