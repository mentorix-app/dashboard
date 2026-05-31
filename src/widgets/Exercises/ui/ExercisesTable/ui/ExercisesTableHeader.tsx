'use client';

import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { Checkbox, TableHead, TableHeader, TableRow } from '@/src/shared/ui';

import type { ExercisesTableHeaderProps } from '../ExercisesTable.types';

export const ExercisesTableHeader: FC<ExercisesTableHeaderProps> = ({
  allSelected,
  someSelected,
  isSelectionDisabled,
  onToggleAll,
}) => {
  const t = useTranslations('Exercises');

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">
          <Checkbox
            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
            onCheckedChange={(value) => onToggleAll(value === true)}
            aria-label={t('selectAll')}
            disabled={isSelectionDisabled}
          />
        </TableHead>
        <TableHead className="min-w-64">{t('columns.name')}</TableHead>
        <TableHead>{t('columns.type')}</TableHead>
        <TableHead>{t('columns.muscleGroup')}</TableHead>
        <TableHead>{t('columns.equipment')}</TableHead>
        <TableHead>{t('columns.difficulty')}</TableHead>
        <TableHead>{t('columns.modifiedAt')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
