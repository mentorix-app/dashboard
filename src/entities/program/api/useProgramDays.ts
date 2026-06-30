'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import { writeProgramDetail } from './programs.utils';
import type {
  AddProgramDayResponse,
  AddProgramDayVariables,
  DeleteProgramDayResponse,
  DeleteProgramDayVariables,
  ReorderProgramDaysResponse,
  ReorderProgramDaysVariables,
} from './programDays.types';

export const useAddProgramDay = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/weeks/{weekId}/days adds a day; responds 409 when the
  // week already holds the maximum of 7 days. Returns 200 with the full program.
  return useMutation<AddProgramDayResponse, HttpError, AddProgramDayVariables>({
    mutationFn: ({ programId, weekId }) =>
      http
        .post<AddProgramDayResponse>(
          `/programs/${encodeURIComponent(programId)}/weeks/${encodeURIComponent(weekId)}/days`
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useReorderProgramDays = () => {
  const queryClient = useQueryClient();

  // PUT /programs/{id}/weeks/{weekId}/days/reorder takes the full ordered list
  // of day ids for the week.
  return useMutation<ReorderProgramDaysResponse, HttpError, ReorderProgramDaysVariables>({
    mutationFn: ({ programId, weekId, dayIds }) =>
      http
        .put<ReorderProgramDaysResponse>(
          `/programs/${encodeURIComponent(programId)}/weeks/${encodeURIComponent(weekId)}/days/reorder`,
          { dayIds }
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useDeleteProgramDay = () => {
  const queryClient = useQueryClient();

  // DELETE /programs/{id}/weeks/{weekId}/days/{dayId} responds 409 when removing
  // the last remaining day in the week; callers surface that as a guard message.
  return useMutation<DeleteProgramDayResponse, HttpError, DeleteProgramDayVariables>({
    mutationFn: ({ programId, weekId, dayId }) =>
      http
        .delete<DeleteProgramDayResponse>(
          `/programs/${encodeURIComponent(programId)}/weeks/${encodeURIComponent(weekId)}/days/${encodeURIComponent(dayId)}`
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};
