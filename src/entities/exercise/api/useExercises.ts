'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, useDelete, useGet, usePost, type HttpError } from '@/src/shared/api';
import type {
  CreateExerciseParams,
  CreateExerciseResponse,
  DeleteExercisesParams,
  DeleteExercisesResponse,
  ExercisesListResult,
  FetchExercisesListParams,
} from './exercises.types';
import { buildExercisesQuery } from './exercises.utils';

export const useExercises = (params: FetchExercisesListParams = {}) =>
  useGet<ExercisesListResult>('/exercises', queryKeys.exercises.list(params), undefined, {
    params: buildExercisesQuery(params),
  });

export const useDeleteExercises = () => {
  const queryClient = useQueryClient();

  return useDelete<DeleteExercisesResponse, HttpError, DeleteExercisesParams>('/exercises', {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all }),
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return usePost<CreateExerciseResponse, HttpError, CreateExerciseParams>('/exercises', {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all }),
  });
};
