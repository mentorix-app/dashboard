'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Exercise } from '@/src/entities/exercise';

export const useExercisesSelection = (exercises: Exercise[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

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

  const handleToggleAllVisible = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current);
      const visibleIds = exercises.map((exercise) => exercise.id);
      const allSelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));

      visibleIds.forEach((id) => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });

      return next;
    });
  }, [exercises]);

  const visibleSelected = useMemo(
    () => new Set(Array.from(selectedIds).filter((id) => exercises.some((exercise) => exercise.id === id))),
    [selectedIds, exercises]
  );

  const selectedExercises = useMemo(
    () => exercises.filter((exercise) => visibleSelected.has(exercise.id)),
    [exercises, visibleSelected]
  );

  return {
    selectedIds,
    setSelectedIds,
    visibleSelected,
    selectedExercises,
    handleToggleRow,
    handleToggleAllVisible,
  };
};
