'use client';

import { useCallback } from 'react';
import type { ExerciseDifficulty, ExerciseEquipment, ExerciseMuscleGroup, ExerciseType } from '@/src/entities/exercise';

import type { ExercisesSearchParamsController } from '../Exercises.types';

export const useExercisesFilters = ({ listParams, updateSearchParams }: ExercisesSearchParamsController) => {
  const handleTypeFilterChange = useCallback(
    (value: ExerciseType, checked: boolean) => {
      updateSearchParams({
        type: checked ? [...(listParams.type ?? []), value] : listParams.type?.filter((item) => item !== value),
      });
    },
    [listParams.type, updateSearchParams]
  );

  const handleMuscleGroupFilterChange = useCallback(
    (value: ExerciseMuscleGroup, checked: boolean) => {
      updateSearchParams({
        muscleGroup: checked
          ? [...(listParams.muscleGroup ?? []), value]
          : listParams.muscleGroup?.filter((item) => item !== value),
      });
    },
    [listParams.muscleGroup, updateSearchParams]
  );

  const handleEquipmentFilterChange = useCallback(
    (value: ExerciseEquipment, checked: boolean) => {
      updateSearchParams({
        equipment: checked
          ? [...(listParams.equipment ?? []), value]
          : listParams.equipment?.filter((item) => item !== value),
      });
    },
    [listParams.equipment, updateSearchParams]
  );

  const handleDifficultyFilterChange = useCallback(
    (value: ExerciseDifficulty, checked: boolean) => {
      updateSearchParams({
        difficulty: checked
          ? [...(listParams.difficulty ?? []), value]
          : listParams.difficulty?.filter((item) => item !== value),
      });
    },
    [listParams.difficulty, updateSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    updateSearchParams({ type: [], muscleGroup: [], equipment: [], difficulty: [] });
  }, [updateSearchParams]);

  const activeFilterCount =
    (listParams.type?.length ?? 0) +
    (listParams.muscleGroup?.length ?? 0) +
    (listParams.equipment?.length ?? 0) +
    (listParams.difficulty?.length ?? 0);

  return {
    activeFilterCount,
    handleTypeFilterChange,
    handleMuscleGroupFilterChange,
    handleEquipmentFilterChange,
    handleDifficultyFilterChange,
    handleClearFilters,
  };
};
