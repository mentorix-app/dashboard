'use client';

import { CircleCheck, CircleDashed, MessageSquare } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/shared/ui';

import type { WeekResultsCellVM } from '../ProgramWeekResults.types';

type WeekResultsCellProps = {
  cell: WeekResultsCellVM;
  /** When set, the submitted cell becomes a button that opens the feedback dialog. */
  onClick?: () => void;
};

export const WeekResultsCell = ({ cell, onClick }: WeekResultsCellProps) => {
  const t = useTranslations('ProgramWeekResults');

  if (!cell.isSubmitted) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={t('cell.missing')}
            className="text-muted-foreground/50 focus-visible:ring-ring inline-flex justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <CircleDashed className="size-4" aria-hidden />
            <span className="sr-only">{t('cell.missing')}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{t('cell.missing')}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={t('cell.submitted')}
          className={cn(
            'focus-visible:ring-ring inline-flex items-center gap-1 rounded-md focus-visible:ring-2 focus-visible:outline-none',
            onClick ? 'cursor-pointer' : 'cursor-default'
          )}
        >
          <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-500" aria-hidden />
          {cell.comments.length > 0 && (
            <span className="text-muted-foreground inline-flex items-center gap-0.5 text-xs">
              <MessageSquare className="size-3" aria-hidden />
              {cell.comments.length}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="flex flex-col gap-1 text-left">
          <p className="whitespace-pre-wrap">{cell.resultText || t('cell.noText')}</p>
          {cell.completedAtLabel && <p className="text-primary-foreground/70 text-xs">{cell.completedAtLabel}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
