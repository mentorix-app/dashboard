'use client';

import { queryKeys, useGet } from '@/src/shared/api';

import type { ProgramWeekResults } from './programWeekResults.types';

/**
 * Per-week client × day results matrix. Enabled once a program id and a valid
 * week number (>= 1) are known. A rest-only week resolves to a 404, surfaced as
 * an empty state by the widget rather than an error toast.
 */
export const useProgramWeekResults = (programId: string | undefined, weekNumber: number | undefined) =>
  useGet<ProgramWeekResults>(
    `/trainer/programs/${programId ?? ''}/weeks/${weekNumber ?? ''}/results`,
    queryKeys.analytics.weekResults(programId ?? '', weekNumber ?? 0),
    { enabled: Boolean(programId) && typeof weekNumber === 'number' && weekNumber >= 1 }
  );
