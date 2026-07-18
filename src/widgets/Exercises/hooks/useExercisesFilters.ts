'use client';

import { useCallback } from 'react';
import type { ExerciseEquipment, ExerciseMuscleGroup, ExerciseScope, ExerciseType } from '@/src/entities/exercise';
import type { Difficulty } from '@/src/shared/types';

import type { ExercisesSearchParamsController } from '../Exercises.types';

export const useExercisesFilters = ({ listParams, updateSearchParams }: ExercisesSearchParamsController) => {
  const handleTypeFilterChange = useCallback(
    (value: ExerciseType, checked: boolean) => {
      updateSearchParams({ type: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleMuscleGroupFilterChange = useCallback(
    (value: ExerciseMuscleGroup, checked: boolean) => {
      updateSearchParams({ muscleGroup: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleEquipmentFilterChange = useCallback(
    (value: ExerciseEquipment, checked: boolean) => {
      updateSearchParams({ equipment: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleDifficultyFilterChange = useCallback(
    (value: Difficulty, checked: boolean) => {
      updateSearchParams({ difficulty: checked ? [value] : [] });
    },
    [updateSearchParams]
  );

  const handleScopeFilterChange = useCallback(
    (value: ExerciseScope | undefined) => {
      updateSearchParams({ scope: value });
    },
    [updateSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    updateSearchParams({ type: [], muscleGroup: [], equipment: [], difficulty: [], scope: undefined });
  }, [updateSearchParams]);

  const activeFilterCount =
    (listParams.type?.length ?? 0) +
    (listParams.muscleGroup?.length ?? 0) +
    (listParams.equipment?.length ?? 0) +
    (listParams.difficulty?.length ?? 0) +
    (listParams.scope ? 1 : 0);

  return {
    activeFilterCount,
    handleTypeFilterChange,
    handleMuscleGroupFilterChange,
    handleEquipmentFilterChange,
    handleDifficultyFilterChange,
    handleScopeFilterChange,
    handleClearFilters,
  };
};
