'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/shared/api/query-keys';

import { fetchExercises, type FetchExercisesParams } from './exercises.mock';

export const useExercises = ({ search }: FetchExercisesParams = {}) =>
  useQuery({
    queryKey: queryKeys.exercises.list({ search }),
    queryFn: () => fetchExercises({ search }),
  });
