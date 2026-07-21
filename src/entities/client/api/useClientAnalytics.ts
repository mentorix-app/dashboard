'use client';

import { queryKeys, useGet, useInfiniteGet } from '@/src/shared/api';

import type { ClientAnalytics, ClientCompletionsParams, ClientCompletionsResult } from './clientAnalytics.types';
import { buildCompletionsQuery } from './clientAnalytics.utils';

const COMPLETIONS_PAGE_SIZE = 20;
/** A calendar month never has more than 31 days, so one page covers it. */
const COMPLETIONS_MONTH_LIMIT = 100;

/**
 * Per-client analytics summary (client card, current program progress, lifetime
 * activity). Trainer-only; returns 404 when the client is not linked to the
 * caller. Pass `enabled: false` to skip the request (e.g. on the self profile).
 */
export const useClientAnalytics = (clientUserId: string, enabled = true) =>
  useGet<ClientAnalytics>(`/trainer/clients/${clientUserId}/analytics`, queryKeys.clients.analytics(clientUserId), {
    enabled: enabled && clientUserId.length > 0,
  });

/** Paginated completion feed (newest first) for the history list + load-more. */
export const useClientCompletionsInfinite = (clientUserId: string, params: ClientCompletionsParams = {}) =>
  useInfiniteGet<ClientCompletionsResult>(
    `/trainer/clients/${clientUserId}/completions`,
    queryKeys.clients.completions(clientUserId, params),
    (page) => ({ ...buildCompletionsQuery(params), page, limit: COMPLETIONS_PAGE_SIZE }),
    (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined,
    { enabled: clientUserId.length > 0 }
  );

/**
 * Single-page completion feed for one calendar month. `from`/`to` bound the
 * visible month (`to` exclusive); the limit covers every day in the range.
 */
export const useClientCompletionsMonth = (clientUserId: string, params: ClientCompletionsParams) =>
  useGet<ClientCompletionsResult>(
    `/trainer/clients/${clientUserId}/completions`,
    queryKeys.clients.completions(clientUserId, { ...params, scope: 'month' }),
    { enabled: clientUserId.length > 0 && Boolean(params.from) && Boolean(params.to) },
    { params: { ...buildCompletionsQuery(params), page: 1, limit: COMPLETIONS_MONTH_LIMIT } }
  );
