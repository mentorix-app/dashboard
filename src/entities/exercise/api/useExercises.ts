'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, useGet, usePost, type HttpError } from '@/src/shared/api';
import type { Exercise } from '../model/types';
import type {
  CreateExerciseParams,
  CreateExerciseResponse,
  DeleteExercisesParams,
  ExercisesListResult,
  FetchExercisesListParams,
  UpdateExerciseResponse,
  UpdateExerciseVariables,
} from './exercises.types';
import { buildExercisesQuery } from './exercises.utils';

export const useExercises = (params: FetchExercisesListParams = {}) =>
  useGet<ExercisesListResult>('/exercises', queryKeys.exercises.list(params), undefined, {
    params: buildExercisesQuery(params),
  });

export const useExercise = (id: string | undefined) =>
  useGet<Exercise>(`/exercises/${id ?? ''}`, queryKeys.exercises.detail(id ?? ''), { enabled: Boolean(id) });

export const useDeleteExercises = () => {
  const queryClient = useQueryClient();

  // Backend exposes single-id deletion (DELETE /exercises/:id, 204). Until bulk
  // deletion lands, remove the selected ids one request at a time.
  return useMutation<void, HttpError, DeleteExercisesParams>({
    mutationFn: async ({ ids }) => {
      await Promise.all(ids.map((id) => http.delete(`/exercises/${encodeURIComponent(id)}`)));
    },
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
