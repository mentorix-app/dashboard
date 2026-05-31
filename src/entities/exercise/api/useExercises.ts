'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/api';
import { fetchExercises } from './exercises.mock';
import type { FetchExercisesParams } from './exercises.types';

export const useExercises = ({ search }: FetchExercisesParams = {}) =>
  useQuery({
    queryKey: queryKeys.exercises.list({ search }),
    queryFn: () => fetchExercises({ search }),
  });
