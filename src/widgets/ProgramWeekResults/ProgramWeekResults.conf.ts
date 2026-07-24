'use client';

import { useLocale, useTranslations } from '@/i18n';
import { useProgramWeekResults } from '@/src/entities/analytics';
import { getClientAvatarSrc, getClientInitials } from '@/src/entities/client';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { WeekResultsClientVM, WeekResultsSummaryVM } from './ProgramWeekResults.types';

type WeekResultsConfig =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  /** Rest-only week (404) or a week with no training days. */
  | { status: 'empty' }
  | {
      status: 'ready';
      dayNumbers: number[];
      clients: WeekResultsClientVM[];
      summary: WeekResultsSummaryVM;
    };

export const useWeekResultsConfig = (programId: string, week: number): WeekResultsConfig => {
  const t = useTranslations('ProgramWeekResults');
  const locale = useLocale();
  const query = useProgramWeekResults(programId, week);

  if (query.isPending) return { status: 'loading' };

  if (query.isError || !query.data) {
    const errorStatus = query.error?.status;
    if (errorStatus === 404) return { status: 'empty' };
    const errorMessage = errorStatus === 403 ? t('errors.forbidden') : t('errors.generic');
    return { status: 'error', errorMessage };
  }

  const { days, clients, summary } = query.data;

  if (days.length === 0) return { status: 'empty' };

  const dayNumbers = days.map((day) => day.dayNumber);

  const clientVMs: WeekResultsClientVM[] = clients.map((client) => ({
    clientUserId: client.clientUserId,
    displayName: client.displayName,
    avatarSrc: getClientAvatarSrc(client.avatarUrl),
    avatarAlt: t('client.avatarAlt', { name: client.displayName }),
    initials: getClientInitials(client.displayName),
    isBehindLatest: client.isBehindLatest,
    progressLabel: t('client.progress', { completed: client.completedDays, total: client.totalDays }),
    completionPercent: client.totalDays > 0 ? Math.round((client.completedDays / client.totalDays) * 100) : 0,
    href: ROUTES.userTraining(client.clientUserId),
    cells: days.map((day, index) => {
      const cell = client.days[index];
      return {
        dayNumber: day.dayNumber,
        isSubmitted: cell?.status === 'submitted',
        completionId: cell?.completionId ?? null,
        resultText: cell?.resultText ?? '',
        completedAtLabel: cell?.completedAt ? formatDate(cell.completedAt, locale, 'dateTime') : null,
        comments: (cell?.comments ?? []).map((comment) => ({
          id: comment.id,
          text: comment.text,
          createdAtLabel: formatDate(comment.createdAt, locale, 'dateTime'),
        })),
      };
    }),
  }));

  const summaryVM: WeekResultsSummaryVM = {
    completionPercent: summary.completionPercent,
    completionLabel: t('percent', { value: summary.completionPercent }),
    submittedValue: summary.submittedCount,
    missingValue: summary.missingCount,
    behindValue: summary.behindClientsCount,
  };

  return { status: 'ready', dayNumbers, clients: clientVMs, summary: summaryVM };
};
