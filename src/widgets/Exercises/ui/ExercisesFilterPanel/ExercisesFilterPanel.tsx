'use client';

import { type FC, useId } from 'react';
import { useTranslations } from '@/i18n';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui';

import {
  EXERCISE_DIFFICULTY_OPTIONS,
  EXERCISE_EQUIPMENT_OPTIONS,
  EXERCISE_MUSCLE_GROUP_OPTIONS,
  EXERCISE_TYPE_OPTIONS,
} from '../../Exercises.constants';
import type { ExercisesFilterPanelProps } from '../ExercisesToolbar/ExercisesToolbar.types';

// Sentinel for the "All" option (Radix Select forbids empty item values).
const CLEAR_VALUE = '__all__';

type FilterSectionProps<T extends string> = {
  title: string;
  clearLabel: string;
  values: readonly T[];
  selectedValues: readonly T[] | undefined;
  getLabel: (value: T) => string;
  onChange: (value: T, checked: boolean) => void;
};

const FilterSection = <T extends string>({
  title,
  clearLabel,
  values,
  selectedValues,
  getLabel,
  onChange,
}: FilterSectionProps<T>) => {
  const id = useId();
  const selected = selectedValues?.[0];

  const handleChange = (next: string) => {
    if (next === CLEAR_VALUE) {
      if (selected) onChange(selected, false);
      return;
    }

    onChange(next as T, true);
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{title}</Label>
      <Select value={selected ?? ''} onValueChange={handleChange}>
        <SelectTrigger id={id} aria-label={title} className="w-full">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CLEAR_VALUE}>{clearLabel}</SelectItem>
          {values.map((value) => (
            <SelectItem key={value} value={value}>
              {getLabel(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const ExercisesFilterPanel: FC<ExercisesFilterPanelProps> = ({
  listParams,
  onTypeFilterChange,
  onMuscleGroupFilterChange,
  onEquipmentFilterChange,
  onDifficultyFilterChange,
}) => {
  const t = useTranslations('Exercises');
  const clearLabel = t('filters.all');

  return (
    <div className="border-border bg-muted/30 grid gap-3 rounded-md border p-4 sm:grid-cols-2 xl:grid-cols-4">
      <FilterSection
        title={t('filters.type')}
        clearLabel={clearLabel}
        values={EXERCISE_TYPE_OPTIONS}
        selectedValues={listParams.type}
        getLabel={(value) => t(`types.${value}`)}
        onChange={onTypeFilterChange}
      />
      <FilterSection
        title={t('filters.muscleGroup')}
        clearLabel={clearLabel}
        values={EXERCISE_MUSCLE_GROUP_OPTIONS}
        selectedValues={listParams.muscleGroup}
        getLabel={(value) => t(`muscleGroups.${value}`)}
        onChange={onMuscleGroupFilterChange}
      />
      <FilterSection
        title={t('filters.equipment')}
        clearLabel={clearLabel}
        values={EXERCISE_EQUIPMENT_OPTIONS}
        selectedValues={listParams.equipment}
        getLabel={(value) => t(`equipment.${value}`)}
        onChange={onEquipmentFilterChange}
      />
      <FilterSection
        title={t('filters.difficulty')}
        clearLabel={clearLabel}
        values={EXERCISE_DIFFICULTY_OPTIONS}
        selectedValues={listParams.difficulty}
        getLabel={(value) => t(`difficulty.${value}`)}
        onChange={onDifficultyFilterChange}
      />
    </div>
  );
};
