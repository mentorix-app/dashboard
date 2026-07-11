'use client';

import { type FC, type KeyboardEvent } from 'react';
import { useLocale, useRouter, useTranslations } from '@/i18n';
import { getProgramName, ProgramStatusBadge } from '@/src/entities/program';
import { Checkbox, TableCell, TableRow } from '@/src/shared/ui';
import { formatDate } from '@/src/shared/lib';

import type { ProgramsTableRowProps } from '../ProgramsTable.types';

export const ProgramsTableRow: FC<ProgramsTableRowProps> = ({
  program,
  isSelected,
  canSelect,
  canManage,
  onToggleRow,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Programs');

  const name = getProgramName(program, locale);

  const navigate = () => router.push(`/programs/${program.id}/basics`, { locale });

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate();
    }
  };

  return (
    <TableRow
      data-state={isSelected ? 'selected' : undefined}
      role="link"
      tabIndex={0}
      onClick={navigate}
      onKeyDown={handleKeyDown}
      aria-label={t('openRow', { name })}
      className="hover:bg-muted/50 focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
    >
      {canSelect ? (
        <TableCell onClick={(event) => event.stopPropagation()}>
          {canManage ? (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleRow(program.id)}
              aria-label={t('selectRow', { name })}
            />
          ) : null}
        </TableCell>
      ) : null}
      <TableCell className="min-w-64">
        <span className="text-foreground truncate font-medium">{name}</span>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <ProgramStatusBadge status={program.status} label={t(`status.${program.status}`)} size="sm" />
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {program.category ? t(`categories.${program.category}`) : '—'}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {program.difficulty ? t(`difficulty.${program.difficulty}`) : '—'}
      </TableCell>
      <TableCell className="whitespace-nowrap">{program.trainingDaysCount}</TableCell>
      <TableCell className="text-muted-foreground max-w-[16rem] truncate">{program.createdByName}</TableCell>
      <TableCell className="whitespace-nowrap">{program.assignmentCount}</TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap">
        {formatDate(program.modifiedAt, locale, 'shortDate')}
      </TableCell>
    </TableRow>
  );
};
