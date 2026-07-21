'use client';

import { useMemo } from 'react';

import { useLocale } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/client';

import type { ClientTrainingConfig } from '../../ClientTraining.types';
import { getReviewStatus } from '../../ClientTraining.utils';

// A reference week (2024-01-01 is a Monday) for building Monday-first labels.
const MONDAY_REFERENCE = new Date(2024, 0, 1);

/** Visual tone for a calendar day, driven by its results' review status. */
export type CalendarDayTone = 'needsAttention' | 'reviewed' | 'none';

const resolveDayTone = (hasCompletion: boolean, needsAttention: boolean): CalendarDayTone => {
  if (!hasCompletion) return 'none';
  if (needsAttention) return 'needsAttention';
  return 'reviewed';
};

export type CalendarDayCell = {
  key: string;
  day: number | null;
  count: number;
  hasCompletion: boolean;
  /** Newest result of the day (feed is newest-first); null for empty/blank days. */
  newest: ClientCompletionItem | null;
  isActive: boolean;
  tone: CalendarDayTone;
};

type CompletionCalendarModel = {
  weekdayLabels: string[];
  monthLabel: string;
  days: CalendarDayCell[];
  /** Results of the selected day, only when that day has more than one. */
  activeDayCompletions: ClientCompletionItem[];
  hasAnyCompletion: boolean;
};

export const useCompletionCalendarConfig = (config: ClientTrainingConfig): CompletionCalendarModel => {
  const locale = useLocale();
  const { month, monthCells, selected } = config;

  const weekdayLabels = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(MONDAY_REFERENCE);
      date.setDate(MONDAY_REFERENCE.getDate() + index);
      return format.format(date);
    });
  }, [locale]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(month.year, month.month, 1)),
    [locale, month]
  );

  const days = useMemo<CalendarDayCell[]>(
    () =>
      monthCells.map((cell, index) => {
        const hasCompletion = cell.completions.length > 0;
        const needsAttention = cell.completions.some((item) => getReviewStatus(item) === 'needsAttention');
        return {
          key: cell.day === null ? `blank-${index}` : `${month.year}-${month.month}-${cell.day}`,
          day: cell.day,
          count: cell.completions.length,
          hasCompletion,
          newest: cell.completions[0] ?? null,
          isActive: cell.completions.some((item) => item.id === selected?.id),
          tone: resolveDayTone(hasCompletion, needsAttention),
        };
      }),
    [monthCells, month, selected]
  );

  const activeDayCompletions = useMemo(() => {
    if (!selected) return [];
    const cell = monthCells.find((entry) => entry.completions.some((item) => item.id === selected.id));
    return cell && cell.completions.length > 1 ? cell.completions : [];
  }, [monthCells, selected]);

  return {
    weekdayLabels,
    monthLabel,
    days,
    activeDayCompletions,
    hasAnyCompletion: monthCells.some((cell) => cell.completions.length > 0),
  };
};
