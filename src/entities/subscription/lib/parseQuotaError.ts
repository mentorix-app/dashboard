import { HttpError } from '@/src/shared/api';
import { PlanCode, QuotaResource, type QuotaExceededError } from '@/src/shared/types';

const QUOTA_RESOURCES = new Set<string>(Object.values(QuotaResource));
const PLAN_CODES = new Set<string>(Object.values(PlanCode));

/**
 * Extracts a `quota_exceeded` payload from a failed mutation. Returns null for
 * any error that is not a 409 quota response so callers can fall back to their
 * own handling.
 */
export const parseQuotaError = (error: unknown): QuotaExceededError | null => {
  if (!(error instanceof HttpError) || error.status !== 409) return null;

  const data = error.cause?.response?.data;
  if (typeof data !== 'object' || data === null) return null;

  const body = data as Record<string, unknown>;
  if (body.error !== 'quota_exceeded') return null;
  if (typeof body.resource !== 'string' || !QUOTA_RESOURCES.has(body.resource)) return null;
  if (typeof body.plan !== 'string' || !PLAN_CODES.has(body.plan)) return null;
  if (typeof body.limit !== 'number' || typeof body.usage !== 'number') return null;

  return {
    error: 'quota_exceeded',
    resource: body.resource as QuotaResource,
    plan: body.plan as PlanCode,
    limit: body.limit,
    usage: body.usage,
  };
};
