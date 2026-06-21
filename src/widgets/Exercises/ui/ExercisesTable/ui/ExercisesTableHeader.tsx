'use client';

import { type FC } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useTranslations } from '@/i18n';
import type { ExerciseSortField } from '@/src/entities/exercise';
import { Button, Checkbox, TableHead, TableHeader, TableRow } from '@/src/shared/ui';

import { SORTABLE_COLUMNS, TABLE_COLUMNS } from '../ExercisesTable.constants';
import type { ExercisesTableHeaderProps } from '../ExercisesTable.types';

export const ExercisesTableHeader: FC<ExercisesTableHeaderProps> = ({
  sortBy,
  sortOrder,
  selectedState,
  isSelectionDisabled,
  canSelect,
  onToggleAllVisible,
  onSortChange,
}) => {
  const t = useTranslations('Exercises');

  return (
    <TableHeader>
      <TableRow>
        {canSelect ? (
          <TableHead className="w-10">
            <Checkbox
              checked={selectedState}
              disabled={isSelectionDisabled}
              onCheckedChange={onToggleAllVisible}
              aria-label={t('selectAll')}
            />
          </TableHead>
        ) : null}
        {TABLE_COLUMNS.map((field) => {
          const isSortable = (SORTABLE_COLUMNS as readonly string[]).includes(field);
          const className = field === 'name' ? 'min-w-64' : undefined;

          if (!isSortable) {
            return (
              <TableHead key={field} className={className}>
                <span className="px-2 font-medium">{t(`columns.${field}`)}</span>
              </TableHead>
            );
          }

          const sortField = field as ExerciseSortField;
          const isActive = sortBy === sortField;
          const SortIcon = isActive ? (sortOrder === 'desc' ? ArrowDown : ArrowUp) : ArrowUpDown;

          return (
            <TableHead key={field} className={className}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-2 h-8 justify-start px-2 font-medium"
                onClick={() => onSortChange(sortField)}
                aria-label={t('sort.change', { column: t(`columns.${field}`) })}
              >
                {t(`columns.${field}`)}
                <SortIcon aria-hidden className={isActive ? 'text-foreground' : 'text-muted-foreground'} />
              </Button>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
