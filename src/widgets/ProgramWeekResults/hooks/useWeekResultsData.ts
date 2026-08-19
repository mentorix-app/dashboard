'use client';

import { useLocale, useTranslations } from '@/i18n';
import { useProgramWeekResults } from '@/src/entities/analytics';
import { getClientAvatarSrc, getClientInitials } from '@/src/entities/client';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { WeekResultsClientVM, WeekResultsSummaryVM } from '../ProgramWeekResults.types';
import { getSortedUniqueNumbers } from '../ProgramWeekResults.utils';

type WeekResultsData =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | { status: 'empty' }
  | {
      status: 'ready';
      rawDayNumbers: number[];
      dayNumbers: number[];
      clients: WeekResultsClientVM[];
      summary: WeekResultsSummaryVM;
    };

export const useWeekResultsData = (programId: string, week: number): WeekResultsData => {
  const t = useTranslations('ProgramWeekResults');
  const locale = useLocale();
  const query = useProgramWeekResults(programId, week);

  if (query.isPending) return { status: 'loading' };

  if (query.isError || !query.data) {
    const errorStatus = query.error?.status;
    if (errorStatus === 404) return { status: 'empty' };
    return { status: 'error', errorMessage: errorStatus === 403 ? t('errors.forbidden') : t('errors.generic') };
  }

  const { days, clients, summary } = query.data;
  if (days.length === 0) return { status: 'empty' };

  const rawDayNumbers = days.map((day) => day.dayNumber);
  const dayNumbers = getSortedUniqueNumbers(rawDayNumbers);
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
    cells: dayNumbers.map((dayNumber) => {
      const cell = client.days[rawDayNumbers.lastIndexOf(dayNumber)];
      return {
        dayNumber,
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

  return {
    status: 'ready',
    rawDayNumbers,
    dayNumbers,
    clients: clientVMs,
    summary: {
      completionPercent: summary.completionPercent,
      completionLabel: t('percent', { value: summary.completionPercent }),
      submittedValue: summary.submittedCount,
      missingValue: summary.missingCount,
      behindValue: summary.behindClientsCount,
    },
  };
};
