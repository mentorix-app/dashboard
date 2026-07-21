'use client';

import { type FC, type KeyboardEvent, type MouseEvent } from 'react';
import { BarChart3, MoreHorizontal, Trash2 } from 'lucide-react';
import { useLocale, useRouter, useTranslations } from '@/i18n';
import { getProgramName, ProgramStatus, ProgramStatusBadge } from '@/src/entities/program';
import { formatDate, ROUTES } from '@/src/shared/lib';
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TableCell,
  TableRow,
} from '@/src/shared/ui';

import type { ProgramsTableRowProps } from '../ProgramsTable.types';

export const ProgramsTableRow: FC<ProgramsTableRowProps> = ({
  program,
  isSelected,
  canSelect,
  canManage,
  onToggleRow,
  onDeleteRow,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Programs');

  const name = getProgramName(program, locale);
  // Drafts have no client results, so analytics is only offered once published.
  const canViewAnalytics = program.status !== ProgramStatus.Draft;
  const hasActions = canViewAnalytics || canManage;

  const navigate = () => router.push(`/programs/${program.id}/basics`, { locale });

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate();
    }
  };

  const handleActionsClick = (event: MouseEvent<HTMLTableCellElement>) => event.stopPropagation();

  const handleAnalytics = () => router.push(ROUTES.programAnalytics(program.id), { locale });

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
      <TableCell className="w-10" onClick={handleActionsClick}>
        {hasActions ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={t('actions.menu', { name })}
              >
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canViewAnalytics ? (
                <DropdownMenuItem onSelect={handleAnalytics}>
                  <BarChart3 aria-hidden />
                  {t('actions.analytics')}
                </DropdownMenuItem>
              ) : null}
              {canManage ? (
                <DropdownMenuItem variant="destructive" onSelect={() => onDeleteRow(program.id)}>
                  <Trash2 aria-hidden />
                  {t('actions.delete')}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </TableCell>
    </TableRow>
  );
};
