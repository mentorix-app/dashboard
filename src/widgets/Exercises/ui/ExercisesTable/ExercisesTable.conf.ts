import { useMemo } from 'react';

import type { ExercisesTableConfig, ExercisesTableProps } from './ExercisesTable.types';

export const useExercisesTableConfig = ({
  exercises,
  isLoading,
  selectedIds,
  canSelectExercise,
}: ExercisesTableProps): ExercisesTableConfig => {
  const selectableExercises = useMemo(
    () => (canSelectExercise ? exercises.filter(canSelectExercise) : exercises),
    [exercises, canSelectExercise]
  );

  const selectedCount = useMemo(
    () => selectableExercises.filter((exercise) => selectedIds.has(exercise.id)).length,
    [selectableExercises, selectedIds]
  );

  return {
    selectedState: selectedCount === 0 ? false : selectedCount === selectableExercises.length ? true : 'indeterminate',
    isSelectionDisabled: selectableExercises.length === 0 || isLoading,
  };
};
