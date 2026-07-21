import type { ClientCompletionsParams } from './clientAnalytics.types';

/**
 * Translates the completions date-range filter into the snake_case query the
 * backend expects for GET /trainer/clients/{id}/completions. The BFF proxy does
 * not convert query params, so this is built by hand. `from`/`to` already match
 * the backend names; `to` is exclusive.
 */
export const buildCompletionsQuery = (params: ClientCompletionsParams): Record<string, string> => {
  const query: Record<string, string> = {};

  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;

  return query;
};
