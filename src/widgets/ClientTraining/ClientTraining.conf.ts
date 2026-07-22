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
  // User's explicit pick tracked by id; falls back to the newest completion.
  // Tracking by id (not the object) keeps the selection fresh after the feed
  // refetches — e.g. once a trainer reply is posted.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const analyticsQuery = useClientAnalytics(clientUserId);
  const completionsQuery = useClientCompletionsInfinite(clientUserId);
  // Only fetch the month feed once the calendar view is opened.
  const range = useMemo(() => monthRange(month), [month]);
  const monthQuery = useClientCompletionsMonth(clientUserId, viewMode === 'calendar' ? range : {});

  const completions = useMemo(
    () => completionsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [completionsQuery.data]
  );

  // Resolve the selection from live query data so it reflects the latest
  // comments; the calendar month feed may hold picks outside the list feed.
  const selected = useMemo(() => {
    const pool = [...completions, ...(monthQuery.data?.items ?? [])];
    return pool.find((item) => item.id === selectedId) ?? completions[0] ?? null;
  }, [completions, monthQuery.data, selectedId]);

  const monthCells = useMemo(() => buildCalendarCells(month, monthQuery.data?.items ?? []), [month, monthQuery.data]);

  const analytics = analyticsQuery.data ?? null;
  const progress = analytics?.currentAssignment?.progress ?? null;

  return {
    locale,
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    analytics,
    statusCounts: progress ? buildStatusCounts(progress, completions) : null,
    weeklyChart: progress ? buildWeeklyChart(progress) : [],
    viewMode,
    onViewModeChange: setViewMode,
    selected,
    onSelect: (completion: ClientCompletionItem) => setSelectedId(completion.id),
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
