'use client';

import { queryKeys, useGet, useInfiniteGet } from '@/src/shared/api';

import { buildProgramsAnalyticsQuery } from '../lib';
import type { FetchProgramsAnalyticsParams, ProgramAnalytics, ProgramsAnalyticsResult } from './programAnalytics.types';

const PROGRAMS_ANALYTICS_PAGE_SIZE = 20;

/** Paginated programs analytics list (all owned programs with aggregates). */
export const useProgramsAnalyticsInfinite = (params: FetchProgramsAnalyticsParams = {}) =>
  useInfiniteGet<ProgramsAnalyticsResult>(
    '/trainer/programs/analytics',
    queryKeys.analytics.programsList(params),
    (page) => ({ ...buildProgramsAnalyticsQuery(params), page, limit: PROGRAMS_ANALYTICS_PAGE_SIZE }),
    (lastPage) => (lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined)
  );

/** Per-program analytics detail (summary, active clients, weekly drop-off). */
export const useProgramAnalytics = (programId: string | undefined) =>
  useGet<ProgramAnalytics>(
    `/trainer/programs/${programId ?? ''}/analytics`,
    queryKeys.analytics.program(programId ?? ''),
    { enabled: Boolean(programId) }
  );
