'use client';

import { useMemo, useState } from 'react';

import { useLocale } from '@/i18n';
import {
  type ClientCompletionItem,
  useClientAnalytics,
  useClientCompletionsInfinite,
  useClientCompletionsMonth,
} from '@/src/entities/analytics';

import type { CalendarMonth, ClientTrainingConfig, ClientTrainingViewMode } from './ClientTraining.types';
import {
  buildCalendarCells,
  buildStatusCounts,
  buildWeeklyChart,
  currentMonth,
  monthRange,
  shiftMonth,
} from './ClientTraining.utils';

export const useClientTrainingConfig = (clientUserId: string): ClientTrainingConfig => {
  const locale = useLocale();

  const [viewMode, setViewMode] = useState<ClientTrainingViewMode>('list');
  const [month, setMonth] = useState<CalendarMonth>(currentMonth);
  // User's explicit pick; falls back to the newest completion during render.
  const [selectedOverride, setSelectedOverride] = useState<ClientCompletionItem | null>(null);

  const analyticsQuery = useClientAnalytics(clientUserId);
  const completionsQuery = useClientCompletionsInfinite(clientUserId);
  // Only fetch the month feed once the calendar view is opened.
  const range = useMemo(() => monthRange(month), [month]);
  const monthQuery = useClientCompletionsMonth(clientUserId, viewMode === 'calendar' ? range : {});

  const completions = useMemo(
    () => completionsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [completionsQuery.data]
  );

  // Default to the newest completion until the trainer picks another.
  const selected = selectedOverride ?? completions[0] ?? null;

  const monthCells = useMemo(() => buildCalendarCells(month, monthQuery.data?.items ?? []), [month, monthQuery.data]);

  const analytics = analyticsQuery.data ?? null;
  const progress = analytics?.currentAssignment?.progress ?? null;

  return {
    locale,
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    analytics,
    statusCounts: progress ? buildStatusCounts(progress) : null,
    weeklyChart: progress ? buildWeeklyChart(progress) : [],
    viewMode,
    onViewModeChange: setViewMode,
    selected,
    onSelect: setSelectedOverride,
    completions,
    hasMore: completionsQuery.hasNextPage ?? false,
    isFetchingMore: completionsQuery.isFetchingNextPage,
    onLoadMore: () => completionsQuery.fetchNextPage(),
    month,
    monthCells,
    isMonthLoading: viewMode === 'calendar' && monthQuery.isLoading,
    onPrevMonth: () => setMonth((prev) => shiftMonth(prev, -1)),
    onNextMonth: () => setMonth((prev) => shiftMonth(prev, 1)),
  };
};
