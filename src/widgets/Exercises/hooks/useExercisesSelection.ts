'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Exercise } from '@/src/entities/exercise';

export const useExercisesSelection = (exercises: Exercise[], canSelectExercise?: (exercise: Exercise) => boolean) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const isSelectable = useCallback(
    (id: string) => {
      if (!canSelectExercise) return true;
      const exercise = exercises.find((item) => item.id === id);
      return !!exercise && canSelectExercise(exercise);
    },
    [exercises, canSelectExercise]
  );

  const handleToggleRow = useCallback(
    (id: string) => {
      if (!isSelectable(id)) return;
      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
          return next;
        }

        next.add(id);
        return next;
      });
    },
    [isSelectable]
  );

  const handleToggleAllVisible = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current);
      const visibleIds = exercises.filter((exercise) => isSelectable(exercise.id)).map((exercise) => exercise.id);
      const allSelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));

      visibleIds.forEach((id) => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });

      return next;
    });
  }, [exercises, isSelectable]);

  const visibleSelected = useMemo(
    () =>
      new Set(
        Array.from(selectedIds).filter((id) => exercises.some((exercise) => exercise.id === id && isSelectable(id)))
      ),
    [selectedIds, exercises, isSelectable]
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
