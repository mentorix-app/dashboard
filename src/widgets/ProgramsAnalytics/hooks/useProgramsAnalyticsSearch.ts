'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { ProgramAnalyticsSortField, ProgramAnalyticsSortOrder } from '@/src/entities/analytics';
import { useDebouncedValue } from '@/src/shared/hooks';

import type {
  ProgramsAnalyticsSearchController,
  ProgramsAnalyticsSearchParamUpdates,
} from '../ProgramsAnalytics.types';
import { createProgramsAnalyticsSearchParams, parseProgramsAnalyticsSearchParams } from '../ProgramsAnalytics.utils';

const SEARCH_DEBOUNCE_MS = 300;

export const useProgramsAnalyticsSearch = (): ProgramsAnalyticsSearchController => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const state = useMemo(() => parseProgramsAnalyticsSearchParams(searchParams), [searchParams]);
  const [search, setSearch] = useState(state.name ?? '');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const updateSearchParams = useCallback(
    (updates: ProgramsAnalyticsSearchParamUpdates, mode: 'push' | 'replace' = 'push') => {
      const next = createProgramsAnalyticsSearchParams(searchParamsKey, updates);
      const query = next.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

      if (mode === 'replace') window.history.replaceState(null, '', nextUrl);
      else window.history.pushState(null, '', nextUrl);
    },
    [searchParamsKey]
  );

  const trimmedSearch = debouncedSearch.trim();
  const nextName = trimmedSearch || undefined;

  useEffect(() => {
    if (nextName !== state.name) updateSearchParams({ name: nextName }, 'replace');
  }, [nextName, state.name, updateSearchParams]);

  const handleSortByChange = useCallback(
    (sortBy: ProgramAnalyticsSortField) => updateSearchParams({ sortBy }),
    [updateSearchParams]
  );

  const handleSortOrderChange = useCallback(
    (sortOrder: ProgramAnalyticsSortOrder) => updateSearchParams({ sortOrder }),
    [updateSearchParams]
  );

  return {
    search,
    listParams: { name: nextName, sortBy: state.sortBy, sortOrder: state.sortOrder },
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    handleSearchChange: setSearch,
    handleSortByChange,
    handleSortOrderChange,
  };
};
