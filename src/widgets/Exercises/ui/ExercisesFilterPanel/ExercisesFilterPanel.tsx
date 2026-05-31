'use client';

import { type FC, useId } from 'react';
import { useTranslations } from '@/i18n';
import { Label, MultiSelect } from '@/src/shared/ui';

import {
  EXERCISE_DIFFICULTY_OPTIONS,
  EXERCISE_EQUIPMENT_OPTIONS,
  EXERCISE_MUSCLE_GROUP_OPTIONS,
  EXERCISE_TYPE_OPTIONS,
} from '../../Exercises.constants';
import type { ExercisesFilterPanelProps } from '../ExercisesToolbar/ExercisesToolbar.types';

type FilterSectionProps<T extends string> = {
  title: string;
  values: readonly T[];
  selectedValues: readonly T[] | undefined;
  getLabel: (value: T) => string;
  onChange: (value: T, checked: boolean) => void;
};

const syncFilterValues = <T extends string>({
  values,
  selectedValues,
  nextValues,
  onChange,
}: FilterSectionProps<T> & { nextValues: readonly string[] }) => {
  const nextSelected = new Set(nextValues);

  values.forEach((value) => {
    const wasSelected = selectedValues?.includes(value) ?? false;
    const isSelected = nextSelected.has(value);
    if (wasSelected !== isSelected) onChange(value, isSelected);
  });
};

const FilterSection = <T extends string>({
  title,
  values,
  selectedValues,
  getLabel,
  onChange,
}: FilterSectionProps<T>) => {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{title}</Label>
      <MultiSelect
        id={id}
        value={selectedValues ?? []}
        options={values.map((value) => ({ value, label: getLabel(value) }))}
        placeholder={title}
        ariaLabel={title}
        onValueChange={(nextValues) =>
          syncFilterValues({ title, values, selectedValues, getLabel, onChange, nextValues })
        }
      />
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

  return (
    <div className="border-border bg-muted/30 grid gap-3 rounded-md border p-4 sm:grid-cols-2 xl:grid-cols-4">
      <FilterSection
        title={t('filters.type')}
        values={EXERCISE_TYPE_OPTIONS}
        selectedValues={listParams.type}
        getLabel={(value) => t(`types.${value}`)}
        onChange={onTypeFilterChange}
      />
      <FilterSection
        title={t('filters.muscleGroup')}
        values={EXERCISE_MUSCLE_GROUP_OPTIONS}
        selectedValues={listParams.muscleGroup}
        getLabel={(value) => t(`muscleGroups.${value}`)}
        onChange={onMuscleGroupFilterChange}
      />
      <FilterSection
        title={t('filters.equipment')}
        values={EXERCISE_EQUIPMENT_OPTIONS}
        selectedValues={listParams.equipment}
        getLabel={(value) => t(`equipment.${value}`)}
        onChange={onEquipmentFilterChange}
      />
      <FilterSection
        title={t('filters.difficulty')}
        values={EXERCISE_DIFFICULTY_OPTIONS}
        selectedValues={listParams.difficulty}
        getLabel={(value) => t(`difficulty.${value}`)}
        onChange={onDifficultyFilterChange}
      />
    </div>
  );
};
