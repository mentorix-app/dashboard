'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/src/shared/hooks';

import type { ProgramsSearchParamUpdateMode, ProgramsSearchParamsController } from '../Programs.types';
import { createProgramsSearchParams, parseProgramsSearchParams } from '../Programs.utils';

const SEARCH_DEBOUNCE_MS = 300;

export const useProgramsSearch = (): ProgramsSearchParamsController => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const listParams = useMemo(() => parseProgramsSearchParams(searchParams), [searchParams]);
  const [search, setSearch] = useState(listParams.name ?? '');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const updateSearchParams = useCallback(
    (updates: Parameters<typeof createProgramsSearchParams>[1], mode: ProgramsSearchParamUpdateMode = 'push') => {
      const next = createProgramsSearchParams(searchParamsKey, updates);
      const query = next.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

      if (mode === 'replace') {
        window.history.replaceState(null, '', nextUrl);
        return;
      }

      window.history.pushState(null, '', nextUrl);
    },
    [searchParamsKey]
  );

  useEffect(() => {
    const nextName = debouncedSearch.trim() || undefined;
    if (nextName === listParams.name) return;

    updateSearchParams({ name: nextName }, 'replace');
  }, [debouncedSearch, listParams.name, updateSearchParams]);

  return {
    search,
    listParams: { ...listParams, name: debouncedSearch.trim() || undefined },
    updateSearchParams,
    handleSearchChange: setSearch,
  };
};
