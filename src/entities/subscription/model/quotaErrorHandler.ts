import type { QuotaExceededError } from '@/src/shared/types';

import { parseQuotaError } from '../lib/parseQuotaError';

type QuotaErrorHandler = (error: QuotaExceededError) => void;

let quotaErrorHandler: QuotaErrorHandler | null = null;

/**
 * Registers the single, app-level handler that surfaces quota errors (e.g. a
 * toast). Mounted once via QuotaErrorBridge so the QueryClient can reach React
 * context (translations, toasts) from outside the component tree.
 */
export const setQuotaErrorHandler = (handler: QuotaErrorHandler | null): void => {
  quotaErrorHandler = handler;
};

/** Global mutation error entry point wired into the QueryClient MutationCache. */
export const handleMutationError = (error: unknown): void => {
  const quota = parseQuotaError(error);
  if (quota && quotaErrorHandler) quotaErrorHandler(quota);
};
