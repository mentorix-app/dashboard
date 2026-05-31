'use client';

import { type FC } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button, Checkbox, TableHead, TableHeader, TableRow } from '@/src/shared/ui';

import { SORTABLE_COLUMNS } from '../ExercisesTable.constants';
import type { ExercisesTableHeaderProps } from '../ExercisesTable.types';

export const ExercisesTableHeader: FC<ExercisesTableHeaderProps> = ({
  sortBy,
  sortOrder,
  selectedState,
  isSelectionDisabled,
  onToggleAllVisible,
  onSortChange,
}) => {
  const t = useTranslations('Exercises');

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">
          <Checkbox
            checked={selectedState}
            disabled={isSelectionDisabled}
            onCheckedChange={onToggleAllVisible}
            aria-label={t('selectAll')}
          />
        </TableHead>
        {SORTABLE_COLUMNS.map((field) => {
          const isActive = sortBy === field;
          const SortIcon = isActive ? (sortOrder === 'desc' ? ArrowDown : ArrowUp) : ArrowUpDown;

          return (
            <TableHead key={field} className={field === 'name' ? 'min-w-64' : undefined}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-2 h-8 justify-start px-2 font-medium"
                onClick={() => onSortChange(field)}
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
