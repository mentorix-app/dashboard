'use client';

import { useCallback, useMemo } from 'react';

import { useProgramsInfinite, type FetchProgramsListParams } from '@/src/entities/program';

export const useProgramsList = (listParams: FetchProgramsListParams) => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useProgramsInfinite(listParams);

  const programs = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    programs,
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    handleLoadMore,
  };
};
