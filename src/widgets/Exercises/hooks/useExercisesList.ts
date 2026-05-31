'use client';

import { useCallback, useMemo } from 'react';
import { useExercises, type FetchExercisesListParams } from '@/src/entities/exercise';

export const useExercisesList = (listParams: FetchExercisesListParams) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useExercises(listParams);
  const exercises = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    exercises,
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    handleLoadMore,
  };
};
