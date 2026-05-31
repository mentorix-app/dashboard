import { useMemo } from 'react';

import type { ExercisesTableConfig, ExercisesTableProps } from './ExercisesTable.types';

export const useExercisesTableConfig = ({
  exercises,
  isLoading,
  selectedIds,
}: ExercisesTableProps): ExercisesTableConfig => {
  const selectedCount = useMemo(
    () => exercises.filter((exercise) => selectedIds.has(exercise.id)).length,
    [exercises, selectedIds]
  );

  return {
    selectedState: selectedCount === 0 ? false : selectedCount === exercises.length ? true : 'indeterminate',
    isSelectionDisabled: exercises.length === 0 || isLoading,
  };
};
