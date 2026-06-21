'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, useGet, useInfiniteGet, usePost, type HttpError } from '@/src/shared/api';
import type { Exercise } from '../model/types';
import type {
  CreateExerciseParams,
  CreateExerciseResponse,
  DeleteExercisesParams,
  DeleteExercisesResponse,
  ExercisesListResult,
  FetchExercisesListParams,
  UpdateExerciseResponse,
  UpdateExerciseVariables,
} from './exercises.types';
import { buildExercisesQuery } from './exercises.utils';

const EXERCISES_PAGE_SIZE = 20;

export const useExercisesInfinite = (params: FetchExercisesListParams = {}) =>
  useInfiniteGet<ExercisesListResult>(
    '/exercises',
    queryKeys.exercises.list(params),
    (page) => ({ ...buildExercisesQuery(params), page, limit: EXERCISES_PAGE_SIZE }),
    (lastPage) => (lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined)
  );

export const useExercise = (id: string | undefined) =>
  useGet<Exercise>(`/exercises/${id ?? ''}`, queryKeys.exercises.detail(id ?? ''), { enabled: Boolean(id) });

export const useDeleteExercises = () => {
  const queryClient = useQueryClient();

  // Backend bulk endpoint handles both single (one id) and bulk deletion.
  return useMutation<DeleteExercisesResponse, HttpError, DeleteExercisesParams>({
    mutationFn: ({ ids }) =>
      http.delete<DeleteExercisesResponse>('/exercises', { data: { ids } }).then((response) => response.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all }),
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return usePost<CreateExerciseResponse, HttpError, CreateExerciseParams>('/exercises', {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all }),
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateExerciseResponse, HttpError, UpdateExerciseVariables>({
    mutationFn: ({ id, params }) =>
      http
        .put<UpdateExerciseResponse>(`/exercises/${encodeURIComponent(id)}`, params)
        .then((response) => response.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all }),
  });
};
