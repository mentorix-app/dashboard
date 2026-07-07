'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import { writeProgramDetail } from '../lib';
import type {
  ExtractProgramBlockExerciseResponse,
  ExtractProgramBlockExerciseVariables,
  MoveProgramDayBlockResponse,
  MoveProgramDayBlockVariables,
  MoveProgramExerciseToBlockResponse,
  MoveProgramExerciseToBlockVariables,
  ReorderProgramBlockExercisesResponse,
  ReorderProgramBlockExercisesVariables,
  ReorderProgramDayBlocksResponse,
  ReorderProgramDayBlocksVariables,
} from '../model/programBlocks';
import { blockExercisesPath, blockPath, dayBlocksPath } from './programBlockPaths';

export const useReorderProgramDayBlocks = () => {
  const queryClient = useQueryClient();

  // PUT .../days/{dayId}/blocks/reorder takes the full ordered list of block ids.
  return useMutation<ReorderProgramDayBlocksResponse, HttpError, ReorderProgramDayBlocksVariables>({
    mutationFn: ({ programId, weekId, dayId, blockIds }) =>
      http
        .put<ReorderProgramDayBlocksResponse>(`${dayBlocksPath(programId, weekId, dayId)}/reorder`, { blockIds })
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useReorderProgramBlockExercises = () => {
  const queryClient = useQueryClient();

  // PUT .../blocks/{blockId}/exercises/reorder takes the full ordered item ids.
  return useMutation<ReorderProgramBlockExercisesResponse, HttpError, ReorderProgramBlockExercisesVariables>({
    mutationFn: ({ programId, weekId, blockId, exerciseItemIds }) =>
      http
        .put<ReorderProgramBlockExercisesResponse>(`${blockExercisesPath(programId, weekId, blockId)}/reorder`, {
          exerciseItemIds,
        })
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useMoveProgramDayBlock = () => {
  const queryClient = useQueryClient();

  // POST .../blocks/{blockId}/move relocates a whole block to another day of the week.
  return useMutation<MoveProgramDayBlockResponse, HttpError, MoveProgramDayBlockVariables>({
    mutationFn: ({ programId, weekId, blockId, ...body }) =>
      http
        .post<MoveProgramDayBlockResponse>(`${blockPath(programId, weekId, blockId)}/move`, body)
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useExtractProgramBlockExercise = () => {
  const queryClient = useQueryClient();

  // POST .../blocks/{blockId}/exercises/{itemId}/extract moves an exercise into a
  // new `single` block on the same day.
  return useMutation<ExtractProgramBlockExerciseResponse, HttpError, ExtractProgramBlockExerciseVariables>({
    mutationFn: ({ programId, weekId, blockId, itemId, ...body }) =>
      http
        .post<ExtractProgramBlockExerciseResponse>(
          `${blockExercisesPath(programId, weekId, blockId)}/${encodeURIComponent(itemId)}/extract`,
          body
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useMoveProgramExerciseToBlock = () => {
  const queryClient = useQueryClient();

  // POST .../blocks/{blockId}/exercises/{itemId}/move moves an exercise into
  // another block of the same week.
  return useMutation<MoveProgramExerciseToBlockResponse, HttpError, MoveProgramExerciseToBlockVariables>({
    mutationFn: ({ programId, weekId, blockId, itemId, targetBlockId }) =>
      http
        .post<MoveProgramExerciseToBlockResponse>(
          `${blockExercisesPath(programId, weekId, blockId)}/${encodeURIComponent(itemId)}/move`,
          { targetBlockId }
        )
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};
