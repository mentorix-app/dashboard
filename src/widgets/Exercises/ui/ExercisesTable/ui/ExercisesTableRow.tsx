'use client';

import { type FC, type KeyboardEvent, type MouseEvent } from 'react';
import { useLocale, useTranslations } from '@/i18n';
import { getExerciseDescription, getExerciseName } from '@/src/entities/exercise';
import { Checkbox, TableCell, TableRow } from '@/src/shared/ui';
import { cn, formatDate } from '@/src/shared/lib';

import type { ExercisesTableRowProps } from '../ExercisesTable.types';

export const ExercisesTableRow: FC<ExercisesTableRowProps> = ({
  exercise,
  isSelected,
  isActive,
  canSelect,
  onToggleRow,
  onRowClick,
}) => {
  const locale = useLocale();
  const t = useTranslations('Exercises');
  const name = getExerciseName(exercise, locale);
  const description = getExerciseDescription(exercise, locale);

  const handleRowClick = () => onRowClick(exercise.id);

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onRowClick(exercise.id);
  };

  const handleSelectCellClick = (event: MouseEvent<HTMLTableCellElement>) => event.stopPropagation();

  return (
    <TableRow
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={t('editRow', { name })}
      data-state={isSelected ? 'selected' : undefined}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      className={cn(
        'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        isActive && 'bg-accent/60 hover:bg-accent/60 border-l-primary border-l-2'
      )}
    >
      {canSelect ? (
        <TableCell onClick={handleSelectCellClick}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleRow(exercise.id)}
            aria-label={t('selectRow', { name })}
          />
        </TableCell>
      ) : null}
      <TableCell className="min-w-64">
        <div className="flex max-w-[28rem] min-w-0 flex-col gap-1">
          <span className="text-foreground truncate font-medium">{name}</span>
          <span className="text-muted-foreground line-clamp-2 text-xs whitespace-normal">{description}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">{t(`types.${exercise.type}`)}</TableCell>
      <TableCell className="whitespace-nowrap">{t(`muscleGroups.${exercise.muscleGroup}`)}</TableCell>
      <TableCell className="whitespace-nowrap">
        {exercise.equipment ? t(`equipment.${exercise.equipment}`) : '—'}
      </TableCell>
      <TableCell className="whitespace-nowrap">{t(`difficulty.${exercise.difficulty}`)}</TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap">
        {formatDate(exercise.modifiedAt, locale, 'shortDate')}
      </TableCell>
    </TableRow>
  );
};
