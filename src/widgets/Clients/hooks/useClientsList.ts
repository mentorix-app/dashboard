'use client';

import { useCallback, useMemo } from 'react';

import { useClientsInfinite, type FetchClientsListParams } from '@/src/entities/client';

export const useClientsList = (listParams: FetchClientsListParams) => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useClientsInfinite(listParams);

  const clients = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    clients,
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    handleLoadMore,
  };
};
