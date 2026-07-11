'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { ClientSortOrder } from '@/src/entities/client';
import type { ViewMode } from '@/src/features/ViewModeSwitch';
import { useDebouncedValue } from '@/src/shared/hooks';

import type {
  ClientsSearchController,
  ClientsSearchParamUpdateMode,
  ClientsSearchParamUpdates,
} from '../Clients.types';
import { createClientsSearchParams, parseClientsSearchParams } from '../Clients.utils';

const SEARCH_DEBOUNCE_MS = 300;

export const useClientsSearch = (): ClientsSearchController => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const state = useMemo(() => parseClientsSearchParams(searchParams), [searchParams]);
  const [search, setSearch] = useState(state.name ?? '');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const updateSearchParams = useCallback(
    (updates: ClientsSearchParamUpdates, mode: ClientsSearchParamUpdateMode = 'push') => {
      const next = createClientsSearchParams(searchParamsKey, updates);
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

  const handleViewChange = useCallback((view: ViewMode) => updateSearchParams({ view }), [updateSearchParams]);

  const handleSortOrderChange = useCallback(
    (order: ClientSortOrder) => updateSearchParams({ order }),
    [updateSearchParams]
  );

  return {
    search,
    listParams: {
      name: nextName,
      sortBy: 'name',
      sortOrder: state.sortOrder,
    },
    view: state.view,
    sortOrder: state.sortOrder,
    handleSearchChange: setSearch,
    handleViewChange,
    handleSortOrderChange,
  };
};
