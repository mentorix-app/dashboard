'use client';

import { useMemo } from 'react';

import type { ExercisesTableConfig, ExercisesTableConfigParams } from './ExercisesTable.types';

export const useExercisesTableConfig = ({
  exercises,
  selectedIds,
}: ExercisesTableConfigParams): ExercisesTableConfig => {
  const allSelected = useMemo(
    () => Boolean(exercises?.length) && (exercises?.every((exercise) => selectedIds.has(exercise.id)) ?? false),
    [exercises, selectedIds]
  );

  const someSelected = useMemo(
    () => (exercises?.some((exercise) => selectedIds.has(exercise.id)) ?? false) && !allSelected,
    [exercises, selectedIds, allSelected]
  );

  return {
    allSelected,
    someSelected,
    isSelectionDisabled: !exercises?.length,
  };
};
