'use client';

import { useProgramsAnalyticsInfinite, type FetchProgramsAnalyticsParams } from '@/src/entities/analytics';

export const useProgramsAnalyticsList = (listParams: FetchProgramsAnalyticsParams) => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useProgramsAnalyticsInfinite(listParams);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return {
    items,
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    handleLoadMore,
  };
};
