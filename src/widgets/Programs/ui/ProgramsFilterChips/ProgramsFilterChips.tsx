'use client';

import { type FC } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button } from '@/src/shared/ui';

import type { ProgramsFilterChipsProps } from '../ProgramsToolbar/ProgramsToolbar.types';

export const ProgramsFilterChips: FC<ProgramsFilterChipsProps> = ({
  listParams,
  activeFilterCount,
  onStatusFilterChange,
  onCategoryFilterChange,
  onDifficultyFilterChange,
  onClearFilters,
}) => {
  const t = useTranslations('Programs');

  if (activeFilterCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {listParams.status?.map((value) => (
        <Button
          key={`status-${value}`}
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => onStatusFilterChange(value, false)}
        >
          {t(`status.${value}`)}
          <X aria-hidden />
        </Button>
      ))}
      {listParams.category?.map((value) => (
        <Button
          key={`category-${value}`}
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => onCategoryFilterChange(value, false)}
        >
          {t(`categories.${value}`)}
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
