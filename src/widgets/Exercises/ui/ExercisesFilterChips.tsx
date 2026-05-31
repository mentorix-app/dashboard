'use client';

import { type FC } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button } from '@/src/shared/ui';

import type { ExercisesFilterChipsProps } from './ExercisesToolbar/ExercisesToolbar.types';

export const ExercisesFilterChips: FC<ExercisesFilterChipsProps> = ({
  listParams,
  activeFilterCount,
  onTypeFilterChange,
  onMuscleGroupFilterChange,
  onEquipmentFilterChange,
  onDifficultyFilterChange,
  onClearFilters,
}) => {
  const t = useTranslations('Exercises');

  if (activeFilterCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {listParams.type?.map((value) => (
        <Button
          key={`type-${value}`}
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => onTypeFilterChange(value, false)}
        >
          {t(`types.${value}`)}
          <X aria-hidden />
        </Button>
      ))}
      {listParams.muscleGroup?.map((value) => (
        <Button
          key={`muscle-${value}`}
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => onMuscleGroupFilterChange(value, false)}
        >
          {t(`muscleGroups.${value}`)}
          <X aria-hidden />
        </Button>
      ))}
      {listParams.equipment?.map((value) => (
        <Button
          key={`equipment-${value}`}
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => onEquipmentFilterChange(value, false)}
        >
          {t(`equipment.${value}`)}
          <X aria-hidden />
        </Button>
      ))}
      {listParams.difficulty?.map((value) => (
        <Button
          key={`difficulty-${value}`}
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => onDifficultyFilterChange(value, false)}
        >
          {t(`difficulty.${value}`)}
          <X aria-hidden />
        </Button>
      ))}
      <Button type="button" variant="ghost" size="xs" onClick={onClearFilters}>
        {t('filters.clearAll')}
      </Button>
    </div>
  );
};
