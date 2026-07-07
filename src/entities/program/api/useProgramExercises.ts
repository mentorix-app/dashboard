'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import { writeProgramDetail } from '../lib';
import type {
  AddProgramBlockExerciseResponse,
  AddProgramBlockExerciseVariables,
  CreateProgramDayBlockResponse,
  CreateProgramDayBlockVariables,
  DeleteProgramBlockExerciseResponse,
  DeleteProgramBlockExerciseVariables,
  UpdateProgramBlockExerciseResponse,
  UpdateProgramBlockExerciseVariables,
} from '../model/programExercises';
import { blockExercisesPath, dayBlocksPath } from './programBlockPaths';

export const useCreateProgramDayBlock = () => {
  const queryClient = useQueryClient();

  // POST .../days/{dayId}/blocks creates a `single` block holding one exercise
  // and responds with the full program.
  return useMutation<CreateProgramDayBlockResponse, HttpError, CreateProgramDayBlockVariables>({
    mutationFn: ({ programId, weekId, dayId, exercise }) =>
      http
        .post<CreateProgramDayBlockResponse>(dayBlocksPath(programId, weekId, dayId), { exercise })
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useAddProgramBlockExercise = () => {
  const queryClient = useQueryClient();

  // POST .../blocks/{blockId}/exercises appends an exercise to a group block.
  return useMutation<AddProgramBlockExerciseResponse, HttpError, AddProgramBlockExerciseVariables>({
    mutationFn: ({ programId, weekId, blockId, ...body }) =>
      http
        .post<AddProgramBlockExerciseResponse>(blockExercisesPath(programId, weekId, blockId), body)
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useUpdateProgramBlockExercise = () => {
  const queryClient = useQueryClient();

  // PUT .../blocks/{blockId}/exercises/{itemId} is a full upsert of the editable
  // fields (exerciseId stays fixed; sets/reps/instruction may change).
  return useMutation<UpdateProgramBlockExerciseResponse, HttpError, UpdateProgramBlockExerciseVariables>({
    mutationFn: ({ programId, weekId, blockId, itemId, ...body }) =>
      http
        .put<UpdateProgramBlockExerciseResponse>(
          `${blockExercisesPath(programId, weekId, blockId)}/${encodeURIComponent(itemId)}`,
          body
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useDeleteProgramBlockExercise = () => {
  const queryClient = useQueryClient();

  // DELETE .../blocks/{blockId}/exercises/{itemId} removes the exercise; a
  // `single` block is removed together with its last exercise.
  return useMutation<DeleteProgramBlockExerciseResponse, HttpError, DeleteProgramBlockExerciseVariables>({
    mutationFn: ({ programId, weekId, blockId, itemId }) =>
      http
        .delete<DeleteProgramBlockExerciseResponse>(
          `${blockExercisesPath(programId, weekId, blockId)}/${encodeURIComponent(itemId)}`
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};
