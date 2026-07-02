'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import { writeProgramDetail } from '../lib';
import type {
  AddProgramDayExerciseResponse,
  AddProgramDayExerciseVariables,
  DeleteProgramDayExerciseResponse,
  DeleteProgramDayExerciseVariables,
  ReorderProgramWeekExercisesResponse,
  ReorderProgramWeekExercisesVariables,
  UpdateProgramDayExerciseResponse,
  UpdateProgramDayExerciseVariables,
} from '../model/programExercises';

const dayExercisesPath = (programId: string, weekId: string, dayId: string) =>
  `/programs/${encodeURIComponent(programId)}/weeks/${encodeURIComponent(weekId)}/days/${encodeURIComponent(dayId)}/exercises`;

export const useAddProgramDayExercise = () => {
  const queryClient = useQueryClient();

  // POST .../days/{dayId}/exercises appends an exercise; responds 201 with the
  // full program. Only exerciseId is required; sets/reps/weight are optional.
  return useMutation<AddProgramDayExerciseResponse, HttpError, AddProgramDayExerciseVariables>({
    mutationFn: ({ programId, weekId, dayId, ...body }) =>
      http
        .post<AddProgramDayExerciseResponse>(dayExercisesPath(programId, weekId, dayId), body)
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useUpdateProgramDayExercise = () => {
  const queryClient = useQueryClient();

  // PUT .../exercises/{itemId} is a full upsert, so it carries every editable
  // field (exerciseId stays fixed; sets/reps/weight/instruction may change).
  return useMutation<UpdateProgramDayExerciseResponse, HttpError, UpdateProgramDayExerciseVariables>({
    mutationFn: ({ programId, weekId, dayId, itemId, ...body }) =>
      http
        .put<UpdateProgramDayExerciseResponse>(
          `${dayExercisesPath(programId, weekId, dayId)}/${encodeURIComponent(itemId)}`,
          body
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useDeleteProgramDayExercise = () => {
  const queryClient = useQueryClient();

  // DELETE .../exercises/{itemId} removes the exercise and returns the program.
  return useMutation<DeleteProgramDayExerciseResponse, HttpError, DeleteProgramDayExerciseVariables>({
    mutationFn: ({ programId, weekId, dayId, itemId }) =>
      http
        .delete<DeleteProgramDayExerciseResponse>(
          `${dayExercisesPath(programId, weekId, dayId)}/${encodeURIComponent(itemId)}`
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useReorderProgramWeekExercises = () => {
  const queryClient = useQueryClient();

  // PUT .../weeks/{weekId}/exercises/reorder reorders within a day and moves
  // exercises between days of the same week; body carries each day's new order.
  return useMutation<ReorderProgramWeekExercisesResponse, HttpError, ReorderProgramWeekExercisesVariables>({
    mutationFn: ({ programId, weekId, days }) =>
      http
        .put<ReorderProgramWeekExercisesResponse>(
          `/programs/${encodeURIComponent(programId)}/weeks/${encodeURIComponent(weekId)}/exercises/reorder`,
          { days }
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};
