'use client';

import { useCallback } from 'react';

import type { ProgramsConfig } from './Programs.types';
import { useProgramsList } from './hooks/useProgramsList';
import { useProgramsSearch } from './hooks/useProgramsSearch';

export const useProgramsConfig = (): ProgramsConfig => {
  const search = useProgramsSearch();
  const list = useProgramsList(search.listParams);

  // Mock: the creation flow is not implemented yet.
  const handleCreateNew = useCallback(() => {
    /* mock create button — wiring to POST /programs comes later */
  }, []);

  return {
    search: search.search,
    listParams: search.listParams,
    programs: list.programs,
    isPending: list.isPending,
    isFetchingNextPage: list.isFetchingNextPage,
    hasNextPage: list.hasNextPage,
    handleSearchChange: search.handleSearchChange,
    handleCreateNew,
    handleLoadMore: list.handleLoadMore,
  };
};
