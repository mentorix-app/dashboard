'use client';

import { type FC, useId } from 'react';
import { useTranslations } from '@/i18n';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui';

import { PROGRAM_CATEGORY_OPTIONS, PROGRAM_DIFFICULTY_OPTIONS, PROGRAM_STATUS_OPTIONS } from '../../Programs.constants';
import type { ProgramsFilterPanelProps } from '../ProgramsToolbar/ProgramsToolbar.types';

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

export const ProgramsFilterPanel: FC<ProgramsFilterPanelProps> = ({
  listParams,
  onStatusFilterChange,
  onCategoryFilterChange,
  onDifficultyFilterChange,
}) => {
  const t = useTranslations('Programs');
  const clearLabel = t('filters.all');

  return (
    <div className="border-border bg-muted/30 grid gap-3 rounded-md border p-4 sm:grid-cols-2 xl:grid-cols-3">
      <FilterSection
        title={t('filters.status')}
        clearLabel={clearLabel}
        values={PROGRAM_STATUS_OPTIONS}
        selectedValues={listParams.status}
        getLabel={(value) => t(`status.${value}`)}
        onChange={onStatusFilterChange}
      />
      <FilterSection
        title={t('filters.category')}
        clearLabel={clearLabel}
        values={PROGRAM_CATEGORY_OPTIONS}
        selectedValues={listParams.category}
        getLabel={(value) => t(`categories.${value}`)}
        onChange={onCategoryFilterChange}
      />
      <FilterSection
        title={t('filters.difficulty')}
        clearLabel={clearLabel}
        values={PROGRAM_DIFFICULTY_OPTIONS}
        selectedValues={listParams.difficulty}
        getLabel={(value) => t(`difficulty.${value}`)}
        onChange={onDifficultyFilterChange}
      />
    </div>
  );
};
