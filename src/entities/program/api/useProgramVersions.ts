'use client';

import { queryKeys, useGet } from '@/src/shared/api';

import type { ProgramVersionsResult } from '../model/programVersions';

/**
 * GET /programs/{id}/versions — frozen version history with per-version
 * assignment counts. Powers the version badge and the "users per version" modal.
 */
export const useProgramVersions = (programId: string | undefined, enabled = true) =>
  useGet<ProgramVersionsResult>(`/programs/${programId ?? ''}/versions`, queryKeys.programs.versions(programId ?? ''), {
    enabled: Boolean(programId) && enabled,
  });
