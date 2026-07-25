'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, useGet, type HttpError } from '@/src/shared/api';

import type {
  ProgramAssignmentsResult,
  SyncProgramAssignmentsResponse,
  SyncProgramAssignmentsVariables,
} from '../model/programAssignments';

/**
 * GET /programs/{id}/assignments — client assignments with `isBehindLatest`,
 * used to decide whether to offer the "sync program" action.
 */
export const useProgramAssignments = (programId: string | undefined, enabled = true) =>
  useGet<ProgramAssignmentsResult>(
    `/programs/${programId ?? ''}/assignments`,
    queryKeys.programs.assignments(programId ?? ''),
    { enabled: Boolean(programId) && enabled }
  );

export const useSyncProgramAssignments = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/assignments/sync moves selected (or all active)
  // assignments to the latest frozen version. Refresh the program tree so
  // versions, assignments, and the badge reflect the new state, and the clients
  // list so each client's assigned program version is no longer stale.
  return useMutation<SyncProgramAssignmentsResponse, HttpError, SyncProgramAssignmentsVariables>({
    mutationFn: ({ programId, params }) =>
      http
        .post<SyncProgramAssignmentsResponse>(`/programs/${encodeURIComponent(programId)}/assignments/sync`, params)
        .then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};
