'use client';

import { useExercises, type FetchExercisesListParams } from '@/src/entities/exercise';

export const useExercisesList = (listParams: FetchExercisesListParams) => {
  const { data, isPending } = useExercises(listParams);
  console.log(data);

  return {
    exercises: data ?? [],
    isPending,
    isFetchingNextPage: false,
    hasNextPage: false,
    handleLoadMore: () => {},
  };
};
