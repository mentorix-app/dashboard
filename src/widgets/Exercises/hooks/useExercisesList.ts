'use client';

import { useExercises, type FetchExercisesListParams } from '@/src/entities/exercise';

export const useExercisesList = (listParams: FetchExercisesListParams) => {
  const { data, isPending } = useExercises(listParams);

  return {
    exercises: data?.items ?? [],
    isPending,
    isFetchingNextPage: false,
    hasNextPage: false,
    handleLoadMore: () => {},
  };
};
