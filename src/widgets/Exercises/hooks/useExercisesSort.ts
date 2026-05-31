'use client';

import { useCallback } from 'react';
import type { ExerciseSortField } from '@/src/entities/exercise';

import type { ExercisesSearchParamsController } from '../Exercises.types';

export const useExercisesSort = ({ listParams, updateSearchParams }: ExercisesSearchParamsController) => {
  const handleSortChange = useCallback(
    (field: ExerciseSortField) => {
      if (listParams.sortBy !== field) {
        updateSearchParams({ sortBy: field, sortOrder: 'asc' });
        return;
      }

      if (listParams.sortOrder === 'asc') {
        updateSearchParams({ sortBy: field, sortOrder: 'desc' });
        return;
      }

      updateSearchParams({ sortBy: undefined, sortOrder: undefined });
    },
    [listParams.sortBy, listParams.sortOrder, updateSearchParams]
  );

  return { handleSortChange };
};
