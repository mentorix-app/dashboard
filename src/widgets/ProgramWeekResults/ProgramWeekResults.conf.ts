'use client';

import { useCallback, useMemo, useState } from 'react';

import { useTranslations } from '@/i18n';
import { useProgramAnalytics } from '@/src/entities/analytics';
import type { CompletionFeedbackTarget } from '@/src/features/CompletionFeedbackDialog';

import type { WeekResultsCellVM, WeekResultsClientVM } from './ProgramWeekResults.types';
import { getSortedUniqueNumbers, resolveSelectedDay } from './ProgramWeekResults.utils';
import { useVisibleWeekClients } from './hooks/useVisibleWeekClients';
import { useWeekResultsData } from './hooks/useWeekResultsData';
import { useWeekResultsState } from './hooks/useWeekResultsState';

const EMPTY_CLIENTS: WeekResultsClientVM[] = [];

export const useProgramWeekResultsConfig = (programId: string) => {
  const t = useTranslations('ProgramWeekResults');
  const analytics = useProgramAnalytics(programId);
  const rawWeekNumbers = useMemo(() => (analytics.data?.weeks ?? []).map((week) => week.weekNumber), [analytics.data]);
  const availableWeeks = useMemo(() => getSortedUniqueNumbers(rawWeekNumbers), [rawWeekNumbers]);
  const state = useWeekResultsState(rawWeekNumbers);
  const weekResults = useWeekResultsData(programId, state.week);
  const readyClients = weekResults.status === 'ready' ? weekResults.clients : EMPTY_CLIENTS;
  const clientFilter = useVisibleWeekClients(readyClients);
  const [feedbackTarget, setFeedbackTarget] = useState<CompletionFeedbackTarget | null>(null);

  const handleOpenFeedback = useCallback(
    (client: WeekResultsClientVM, cell: WeekResultsCellVM) =>
      setFeedbackTarget({
        clientUserId: client.clientUserId,
        displayName: client.displayName,
        dayNumber: cell.dayNumber,
        completionId: cell.completionId,
        resultText: cell.resultText,
        completedAtLabel: cell.completedAtLabel,
        comments: cell.comments,
      }),
    []
  );
  const handleFeedbackOpenChange = useCallback((open: boolean) => {
    if (!open) setFeedbackTarget(null);
  }, []);

  const weekOptions = useMemo(
    () => availableWeeks.map((value) => ({ value, label: t('weekLabel', { number: value }) })),
    [availableWeeks, t]
  );
  const selectedDay = weekResults.status === 'ready' ? resolveSelectedDay(weekResults.rawDayNumbers, state.day) : 0;

  return {
    pageStatus: analytics.isPending ? 'loading' : analytics.isError || availableWeeks.length === 0 ? 'empty' : 'ready',
    weekOptions,
    weekResults,
    visibleClients: clientFilter.visibleClients,
    selectedDay,
    feedbackTarget,
    state,
    search: clientFilter.search,
    handleSearchChange: clientFilter.setSearch,
    handleOpenFeedback,
    handleFeedbackOpenChange,
    emptyCopy: {
      noWeeksTitle: t('empty.noWeeksTitle'),
      noWeeksDescription: t('empty.noWeeksDescription'),
      weekTitle: t('empty.weekTitle'),
      weekDescription: t('empty.weekDescription'),
      noClientsTitle: t('empty.noClientsTitle'),
      noClientsDescription: t('empty.noClientsDescription'),
      noMatchesTitle: t('empty.noMatchesTitle'),
      noMatchesDescription: t('empty.noMatchesDescription'),
    },
  };
};
