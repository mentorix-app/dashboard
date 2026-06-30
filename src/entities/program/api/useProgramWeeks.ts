'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, type HttpError } from '@/src/shared/api';
import type { ProgramDetail } from '../model/structure.types';
import type {
  AddProgramWeekResponse,
  AddProgramWeekVariables,
  DeleteProgramWeekResponse,
  DeleteProgramWeekVariables,
  ReorderProgramWeeksResponse,
  ReorderProgramWeeksVariables,
} from './programWeeks.types';

// Every week mutation returns the full updated program, so we write it straight
// into the detail cache instead of refetching, then mark sibling queries stale
// without firing a request.
const writeDetail = (queryClient: ReturnType<typeof useQueryClient>, program: ProgramDetail) => {
  queryClient.setQueriesData<ProgramDetail>({ queryKey: queryKeys.programs.detail(program.id) }, program);
  queryClient.invalidateQueries({ queryKey: queryKeys.programs.all, refetchType: 'none' });
};

export const useAddProgramWeek = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/weeks creates the next week plus its 7 default days.
  return useMutation<AddProgramWeekResponse, HttpError, AddProgramWeekVariables>({
    mutationFn: ({ programId }) =>
      http
        .post<AddProgramWeekResponse>(`/programs/${encodeURIComponent(programId)}/weeks`)
        .then((response) => response.data),
    onSuccess: (program) => writeDetail(queryClient, program),
  });
};

export const useReorderProgramWeeks = () => {
  const queryClient = useQueryClient();

  // PUT /programs/{id}/weeks/reorder takes the full ordered list of week ids.
  return useMutation<ReorderProgramWeeksResponse, HttpError, ReorderProgramWeeksVariables>({
    mutationFn: ({ programId, weekIds }) =>
      http
        .put<ReorderProgramWeeksResponse>(`/programs/${encodeURIComponent(programId)}/weeks/reorder`, { weekIds })
        .then((response) => response.data),
    onSuccess: (program) => writeDetail(queryClient, program),
  });
};

export const useDeleteProgramWeek = () => {
  const queryClient = useQueryClient();

  // DELETE /programs/{id}/weeks/{weekId} responds 409 when removing the last
  // remaining week; callers surface that as a guard message.
  return useMutation<DeleteProgramWeekResponse, HttpError, DeleteProgramWeekVariables>({
    mutationFn: ({ programId, weekId }) =>
      http
        .delete<DeleteProgramWeekResponse>(
          `/programs/${encodeURIComponent(programId)}/weeks/${encodeURIComponent(weekId)}`
        )
        .then((response) => response.data),
    onSuccess: (program) => writeDetail(queryClient, program),
  });
};
