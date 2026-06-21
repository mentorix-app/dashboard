'use client';

import { useCallback, useMemo } from 'react';

import { useExercisesInfinite, type FetchExercisesListParams } from '@/src/entities/exercise';

export const useExercisesList = (listParams: FetchExercisesListParams) => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useExercisesInfinite(listParams);

  const exercises = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    exercises,
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    handleLoadMore,
  };
};
