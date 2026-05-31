'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/src/shared/hooks';

import type { ExercisesSearchParamUpdateMode, ExercisesSearchParamsController } from '../Exercises.types';
import { createExercisesSearchParams, parseExercisesSearchParams } from '../Exercises.utils';

const SEARCH_DEBOUNCE_MS = 300;

export const useExercisesSearch = (): ExercisesSearchParamsController => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const listParams = useMemo(() => parseExercisesSearchParams(searchParams), [searchParams]);
  const [search, setSearch] = useState(listParams.name ?? '');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const updateSearchParams = useCallback(
    (updates: Parameters<typeof createExercisesSearchParams>[1], mode: ExercisesSearchParamUpdateMode = 'push') => {
      const next = createExercisesSearchParams(searchParamsKey, updates);
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
    listParams: {
      ...listParams,
      name: debouncedSearch.trim() || undefined,
    },
    updateSearchParams,
    handleSearchChange: setSearch,
  };
};
