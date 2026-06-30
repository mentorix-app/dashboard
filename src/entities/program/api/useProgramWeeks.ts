'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import { writeProgramDetail } from './programs.utils';
import type {
  AddProgramWeekResponse,
  AddProgramWeekVariables,
  DeleteProgramWeekResponse,
  DeleteProgramWeekVariables,
  ReorderProgramWeeksResponse,
  ReorderProgramWeeksVariables,
} from './programWeeks.types';

export const useAddProgramWeek = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/weeks creates the next week plus its 7 default days.
  return useMutation<AddProgramWeekResponse, HttpError, AddProgramWeekVariables>({
    mutationFn: ({ programId }) =>
      http
        .post<AddProgramWeekResponse>(`/programs/${encodeURIComponent(programId)}/weeks`)
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
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
    onSuccess: (program) => writeProgramDetail(queryClient, program),
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
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};
