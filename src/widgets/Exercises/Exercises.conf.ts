'use client';

import { useCallback, useMemo, useState } from 'react';
import { useExercises } from '@/src/entities/exercise';
import { useDebouncedValue } from '@/src/shared/hooks';

import type { ExercisesConfig } from './Exercises.types';

const SEARCH_DEBOUNCE_MS = 300;

export const useExercisesConfig = (): ExercisesConfig => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { data: exercises, isPending } = useExercises({ search: debouncedSearch || undefined });

  const handleToggleRow = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }

      next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(
    (shouldSelectAll: boolean) => {
      if (!exercises) return;

      setSelectedIds(shouldSelectAll ? new Set(exercises.map((exercise) => exercise.id)) : new Set());
    },
    [exercises]
  );

  const handleCreateNew = useCallback(() => undefined, []);

  const visibleSelected = useMemo(
    () => new Set(Array.from(selectedIds).filter((id) => exercises?.some((exercise) => exercise.id === id))),
    [selectedIds, exercises]
  );

  return {
    search,
    exercises,
    isPending,
    visibleSelected,
    handleSearchChange: setSearch,
    handleCreateNew,
    handleToggleRow,
    handleToggleAll,
  };
};
