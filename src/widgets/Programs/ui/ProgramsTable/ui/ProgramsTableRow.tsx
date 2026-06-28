'use client';

import { type FC } from 'react';
import { useLocale, useTranslations } from '@/i18n';
import { Checkbox, TableCell, TableRow } from '@/src/shared/ui';

import { PLACEHOLDER_COUNT } from '../ProgramsTable.constants';
import type { ProgramsTableRowProps } from '../ProgramsTable.types';
import { formatModifiedAt } from '../ProgramsTable.utils';

export const ProgramsTableRow: FC<ProgramsTableRowProps> = ({
  program,
  isSelected,
  canSelect,
  canManage,
  onToggleRow,
}) => {
  const locale = useLocale();
  const t = useTranslations('Programs');

  return (
    <TableRow data-state={isSelected ? 'selected' : undefined}>
      {canSelect ? (
        <TableCell>
          {canManage ? (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleRow(program.id)}
              aria-label={t('selectRow', { name: program.name })}
            />
          ) : null}
        </TableCell>
      ) : null}
      <TableCell className="min-w-64">
        <span className="text-foreground truncate font-medium">{program.name}</span>
      </TableCell>
      <TableCell className="whitespace-nowrap">{t(`status.${program.status}`)}</TableCell>
      <TableCell className="whitespace-nowrap">
        {program.category ? t(`categories.${program.category}`) : '—'}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {program.difficulty ? t(`difficulty.${program.difficulty}`) : '—'}
      </TableCell>
      <TableCell className="whitespace-nowrap">{PLACEHOLDER_COUNT}</TableCell>
      <TableCell className="whitespace-nowrap">{PLACEHOLDER_COUNT}</TableCell>
      <TableCell className="text-muted-foreground max-w-[16rem] truncate font-mono text-xs">
        {program.createdBy}
      </TableCell>
      <TableCell className="whitespace-nowrap">{PLACEHOLDER_COUNT}</TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap">
        {formatModifiedAt(program.modifiedAt, locale)}
      </TableCell>
    </TableRow>
  );
};
