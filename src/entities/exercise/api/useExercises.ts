'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, useDelete, useGet, usePost, type HttpError } from '@/src/shared/api';
import type {
  CreateExerciseParams,
  CreateExerciseResponse,
  DeleteExercisesParams,
  DeleteExercisesResponse,
  FetchExercisesListParams,
} from './exercises.types';
import type { Exercise } from '../model/types';

const buildQueryParams = (params: FetchExercisesListParams): Record<string, string | string[]> => {
  const result: Record<string, string | string[]> = {};
  if (params.name) result.name = params.name;
  if (params.type?.length) result.type = params.type;
  if (params.muscleGroup?.length) result.muscleGroup = params.muscleGroup;
  if (params.equipment?.length) result.equipment = params.equipment;
  if (params.difficulty?.length) result.difficulty = params.difficulty;
  if (params.sortBy) result.sortBy = params.sortBy;
  if (params.sortOrder) result.sortOrder = params.sortOrder;
  return result;
};

export const useExercises = (params: FetchExercisesListParams = {}) =>
  useGet<Exercise[]>('/exercises', queryKeys.exercises.list(params), undefined, {
    params: buildQueryParams(params),
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
