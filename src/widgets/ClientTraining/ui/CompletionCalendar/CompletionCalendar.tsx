'use client';

import { type FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useLocale, useTranslations } from '@/i18n';
import { formatDate } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';
import { Button, Skeleton } from '@/src/shared/ui';

import type { ClientTrainingConfig } from '../../ClientTraining.types';
import { CompletionStatusBadge } from '../CompletionStatusBadge';
import { type CalendarDayTone, useCompletionCalendarConfig } from './CompletionCalendar.conf';

const DAY_TONE_CLASS: Record<CalendarDayTone, string> = {
  needsAttention:
    'bg-amber-100 font-medium text-amber-700 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900',
  reviewed:
    'bg-emerald-100 font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900',
  none: 'text-muted-foreground/60',
};

type CompletionCalendarProps = {
  config: ClientTrainingConfig;
  /** Fired when a completion is definitively picked (used to dismiss the mobile modal). */
  onPicked?: () => void;
};

export const CompletionCalendar: FC<CompletionCalendarProps> = ({ config, onPicked }) => {
  const t = useTranslations('ClientProfile');
  const locale = useLocale();
  const { isMonthLoading, selected, onSelect, onPrevMonth, onNextMonth } = config;
  const { weekdayLabels, monthLabel, days, activeDayCompletions, hasAnyCompletion } =
    useCompletionCalendarConfig(config);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onPrevMonth} aria-label={t('history.prevMonth')}>
          <ChevronLeft aria-hidden />
        </Button>
        <span className="text-sm font-medium capitalize">{monthLabel}</span>
        <Button variant="ghost" size="icon-sm" onClick={onNextMonth} aria-label={t('history.nextMonth')}>
          <ChevronRight aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayLabels.map((label, index) => (
          <span key={index} className="text-muted-foreground pb-1 text-[0.6875rem] font-medium">
            {label}
          </span>
        ))}

        {isMonthLoading
          ? Array.from({ length: 35 }, (_, index) => <Skeleton key={index} className="aspect-square rounded-md" />)
          : days.map((cell) => {
              if (cell.day === null) {
                return <span key={cell.key} aria-hidden />;
              }

              return (
                <button
                  key={cell.key}
                  type="button"
                  disabled={!cell.hasCompletion}
                  aria-current={cell.isActive}
                  onClick={() => {
                    if (!cell.newest) return;
                    onSelect(cell.newest);
                    // A single-result day is a final pick; multi-result days expand the list below.
                    if (cell.count === 1) onPicked?.();
                  }}
                  className={cn(
                    'relative flex aspect-square items-center justify-center rounded-md text-sm tabular-nums transition-colors',
                    DAY_TONE_CLASS[cell.tone],
                    cell.isActive && 'ring-primary ring-2 ring-inset'
                  )}
                >
                  {cell.day}
                  {cell.count > 1 ? (
                    <span
                      className="bg-foreground text-background absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[0.625rem] font-semibold"
                      aria-label={t('history.dayCount', { count: cell.count })}
                    >
                      {cell.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
      </div>

      {!isMonthLoading && hasAnyCompletion ? (
        <div className="text-muted-foreground flex items-center justify-center gap-4 text-[0.6875rem]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" aria-hidden />
            {t('history.status.needsAttention')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
            {t('history.status.reviewed')}
          </span>
        </div>
      ) : null}

      {activeDayCompletions.length > 0 ? (
        <div className="flex flex-col gap-1.5 border-t pt-3">
          <span className="text-muted-foreground text-xs font-medium">{t('history.dayResults')}</span>
          <ul className="scrollbar-slim flex flex-col gap-1 pr-1.5 sm:max-h-56 sm:overflow-y-auto">
            {activeDayCompletions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onPicked?.();
                  }}
                  aria-current={item.id === selected?.id}
                  className={cn(
                    'hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors',
                    item.id === selected?.id ? 'border-primary bg-muted' : 'border-transparent'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium">
                      {t('detail.weekDay', { week: item.weekNumber, day: item.dayNumber })}
                    </span>
                    <CompletionStatusBadge completion={item} />
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatDate(item.completedAt, locale, 'dateTime')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!isMonthLoading && !hasAnyCompletion ? (
        <p className="text-muted-foreground text-center text-xs">{t('history.monthEmpty')}</p>
      ) : null}
    </div>
  );
};
