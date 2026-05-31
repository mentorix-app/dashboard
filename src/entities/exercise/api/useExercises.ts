'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/api';
import { deleteExercises, fetchExercises } from './exercises.mock';
import type { DeleteExercisesParams, FetchExercisesListParams } from './exercises.types';

const INITIAL_EXERCISES_LIMIT = 30;
const NEXT_EXERCISES_LIMIT = 20;

export const useExercises = (params: FetchExercisesListParams = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.exercises.list(params),
    queryFn: ({ pageParam }) =>
      fetchExercises({
        ...params,
        cursor: pageParam,
        limit: pageParam === 0 ? INITIAL_EXERCISES_LIMIT : NEXT_EXERCISES_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const useDeleteExercises = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteExercisesParams) => deleteExercises(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all }),
  });
};
