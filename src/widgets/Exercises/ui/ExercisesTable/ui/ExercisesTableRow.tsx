'use client';

import { type FC } from 'react';
import { useLocale, useTranslations } from '@/i18n';
import { Checkbox, TableCell, TableRow } from '@/src/shared/ui';

import type { ExercisesTableRowProps } from '../ExercisesTable.types';
import { formatModifiedAt } from '../ExercisesTable.utils';

export const ExercisesTableRow: FC<ExercisesTableRowProps> = ({ exercise, isSelected, onToggleRow }) => {
  const locale = useLocale();
  const t = useTranslations('Exercises');

  return (
    <TableRow data-state={isSelected ? 'selected' : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleRow(exercise.id)}
          aria-label={t('selectRow', { name: exercise.name })}
        />
      </TableCell>
      <TableCell className="min-w-64">
        <div className="flex flex-col gap-1">
          <span className="text-foreground font-medium">{exercise.name}</span>
          <span className="text-muted-foreground line-clamp-2 text-xs">{exercise.description}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">{t(`types.${exercise.type}`)}</TableCell>
      <TableCell className="whitespace-nowrap">{t(`muscleGroups.${exercise.muscleGroup}`)}</TableCell>
      <TableCell className="whitespace-nowrap">{t(`equipment.${exercise.equipment}`)}</TableCell>
      <TableCell className="whitespace-nowrap">{t(`difficulty.${exercise.difficulty}`)}</TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap">
        {formatModifiedAt(exercise.modifiedAt, locale)}
      </TableCell>
    </TableRow>
  );
};
