'use client';

import { useLocale, useTranslations } from '@/i18n';
import { useProgramAnalytics } from '@/src/entities/analytics';
import { getClientAvatarSrc, getClientInitials } from '@/src/entities/client';
import { getProgramName } from '@/src/entities/program';
import { formatDate, ROUTES } from '@/src/shared/lib';
import type { ChartConfig } from '@/src/shared/ui';

import type {
  ProgramAnalyticsClientVM,
  ProgramAnalyticsHeaderVM,
  ProgramAnalyticsSummaryVM,
  WeeklyDropOffPoint,
} from './ProgramAnalytics.types';
import { countBehindLatest, toProgramStatusEnum } from './ProgramAnalytics.utils';

type ProgramAnalyticsConfig =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | {
      status: 'ready';
      header: ProgramAnalyticsHeaderVM;
      summary: ProgramAnalyticsSummaryVM;
      chartConfig: ChartConfig;
      chartData: WeeklyDropOffPoint[];
      clients: ProgramAnalyticsClientVM[];
    };

export const useProgramAnalyticsConfig = (programId: string): ProgramAnalyticsConfig => {
  const t = useTranslations('ProgramAnalytics');
  const locale = useLocale();
  const query = useProgramAnalytics(programId);

  if (query.isPending) return { status: 'loading' };

  if (query.isError || !query.data) {
    const errorStatus = query.error?.status;
    const errorMessage =
      errorStatus === 404 ? t('errors.notFound') : errorStatus === 403 ? t('errors.forbidden') : t('errors.generic');
    return { status: 'error', errorMessage };
  }

  const { program, summary, clients, weeks } = query.data;

  const header: ProgramAnalyticsHeaderVM = {
    name: getProgramName(program, locale),
    status: toProgramStatusEnum(program.status),
    statusLabel: t(`status.${program.status}`),
    versionLabel:
      program.latestVersionNumber > 0 ? t('version', { number: program.latestVersionNumber }) : t('notPublished'),
    trainingDaysLabel: t('trainingDays', { count: program.trainingDaysCount }),
    lastActivityLabel: summary.lastActivityAt
      ? t('lastActivity', { date: formatDate(summary.lastActivityAt, locale, 'shortDate') })
      : t('lastActivityNever'),
    backHref: ROUTES.analytics,
    editHref: ROUTES.programBasics(program.programId),
  };

  const summaryVM: ProgramAnalyticsSummaryVM = {
    activeClients: summary.activeClientsCount,
    totalCompletions: summary.totalCompletions,
    completionsLast30Days: summary.completionsLast30Days,
    avgCompletionLabel:
      summary.avgCompletionPercent === null ? t('summary.none') : t('percent', { value: summary.avgCompletionPercent }),
    behindLatestCount: countBehindLatest(clients),
  };

  const chartConfig: ChartConfig = {
    completions: { label: t('weekly.completions'), color: 'var(--chart-1)' },
    distinctClients: { label: t('weekly.distinctClients'), color: 'var(--chart-2)' },
  };

  const chartData: WeeklyDropOffPoint[] = weeks.map((week) => ({
    week: t('weekly.week', { number: week.weekNumber }),
    completions: week.completionsCount,
    distinctClients: week.distinctClientsCount,
  }));

  const clientVMs: ProgramAnalyticsClientVM[] = clients.map((client) => ({
    clientUserId: client.clientUserId,
    displayName: client.displayName,
    avatarSrc: getClientAvatarSrc(client.avatarUrl),
    avatarAlt: t('clients.avatarAlt', { name: client.displayName }),
    initials: getClientInitials(client.displayName),
    assignedLabel: formatDate(client.assignedAt, locale, 'shortDate'),
    completionPercent: client.completionPercent,
    daysLabel: t('clients.days', { completed: client.completedDays, total: client.totalTrainingDays }),
    isBehindLatest: client.isBehindLatest,
    versionLabel: client.isBehindLatest ? t('clients.versionBehind') : t('clients.versionLatest'),
    lastCompletedLabel: client.lastCompletedAt
      ? formatDate(client.lastCompletedAt, locale, 'shortDate')
      : t('clients.never'),
    lastCompletedAt: client.lastCompletedAt,
    href: ROUTES.userTraining(client.clientUserId),
  }));

  return {
    status: 'ready',
    header,
    summary: summaryVM,
    chartConfig,
    chartData,
    clients: clientVMs,
  };
};
