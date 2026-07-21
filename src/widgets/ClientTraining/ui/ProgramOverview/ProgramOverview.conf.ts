'use client';

import { useMemo } from 'react';

import { useTranslations } from '@/i18n';
import type { ChartConfig } from '@/src/shared/ui';

import type { ClientTrainingConfig } from '../../ClientTraining.types';

type OverviewActivityStat = {
  id: string;
  label: string;
  value: number;
};

type OverviewChartPoint = {
  week: string;
  completed: number;
  remaining: number;
};

type ProgramOverviewModel = {
  chartConfig: ChartConfig;
  chartData: OverviewChartPoint[];
  activityStats: OverviewActivityStat[];
  firstCompletedAt: string | null;
};

export const useProgramOverviewConfig = (config: ClientTrainingConfig): ProgramOverviewModel => {
  const t = useTranslations('ClientProfile');
  const { analytics, weeklyChart } = config;
  const activity = analytics?.activity;

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      completed: { label: t('overview.chartCompleted'), color: 'var(--chart-2)' },
      remaining: { label: t('overview.chartRemaining'), color: 'var(--chart-1)' },
    }),
    [t]
  );

  const chartData = useMemo<OverviewChartPoint[]>(
    () =>
      weeklyChart.map((point) => ({
        week: t('overview.week', { number: point.weekNumber }),
        completed: point.completed,
        remaining: Math.max(point.total - point.completed, 0),
      })),
    [weeklyChart, t]
  );

  const activityStats = useMemo<OverviewActivityStat[]>(
    () => [
      { id: 'total', label: t('activity.total'), value: activity?.totalCompletions ?? 0 },
      { id: 'last7', label: t('activity.last7'), value: activity?.completionsLast7Days ?? 0 },
      { id: 'last30', label: t('activity.last30'), value: activity?.completionsLast30Days ?? 0 },
      { id: 'streak', label: t('activity.streak'), value: activity?.weekStreak ?? 0 },
    ],
    [activity, t]
  );

  return {
    chartConfig,
    chartData,
    activityStats,
    firstCompletedAt: activity?.firstCompletedAt ?? null,
  };
};
