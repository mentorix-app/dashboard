'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/src/shared/hooks';

import type { ProgramsSearchParamsController } from '../Programs.types';
import { createProgramsSearchParams, parseProgramsSearchParams } from '../Programs.utils';

const SEARCH_DEBOUNCE_MS = 300;

export const useProgramsSearch = (): ProgramsSearchParamsController => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const listParams = useMemo(() => parseProgramsSearchParams(searchParams), [searchParams]);
  const [search, setSearch] = useState(listParams.name ?? '');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const updateName = useCallback(
    (name: string | undefined) => {
      const next = createProgramsSearchParams(searchParamsKey, { name });
      const query = next.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    },
    [searchParamsKey]
  );

  useEffect(() => {
    const nextName = debouncedSearch.trim() || undefined;
    if (nextName === listParams.name) return;

    updateName(nextName);
  }, [debouncedSearch, listParams.name, updateName]);

  return {
    search,
    listParams: { ...listParams, name: debouncedSearch.trim() || undefined },
    handleSearchChange: setSearch,
  };
};
