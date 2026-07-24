'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from '@/i18n';
import { CompletionFeedbackDialog, type CompletionFeedbackTarget } from '@/src/features/CompletionFeedbackDialog';
import { useProgramAnalytics } from '@/src/entities/analytics';
import { Typography } from '@/src/shared/ui';

import { useWeekResultsConfig } from './ProgramWeekResults.conf';
import type { WeekResultsCellVM, WeekResultsClientVM } from './ProgramWeekResults.types';
import { resolveSelectedDay } from './ProgramWeekResults.utils';
import { useVisibleWeekClients } from './hooks/useVisibleWeekClients';
import { useWeekResultsState } from './hooks/useWeekResultsState';
import { WeekResultsCards } from './ui/WeekResultsCards';
import { WeekResultsEmpty } from './ui/WeekResultsEmpty';
import { WeekResultsSkeleton } from './ui/WeekResultsSkeleton';
import { WeekResultsSummary } from './ui/WeekResultsSummary';
import { WeekResultsTable } from './ui/WeekResultsTable';
import { WeekResultsToolbar } from './ui/WeekResultsToolbar';

const EMPTY_CLIENTS: WeekResultsClientVM[] = [];

type ProgramWeekResultsProps = {
  programId: string;
};

export const ProgramWeekResults = ({ programId }: ProgramWeekResultsProps) => {
  const t = useTranslations('ProgramWeekResults');
  const analytics = useProgramAnalytics(programId);

  const availableWeeks = useMemo(
    () => (analytics.data?.weeks ?? []).map((week) => week.weekNumber).sort((first, second) => first - second),
    [analytics.data]
  );
  const defaultWeek = availableWeeks[0] ?? 0;

  const { week, view, day, setWeek, setView, setDay } = useWeekResultsState(availableWeeks, defaultWeek);
  const config = useWeekResultsConfig(programId, week);
  const readyClients = config.status === 'ready' ? config.clients : EMPTY_CLIENTS;
  const { search, setSearch, visibleClients } = useVisibleWeekClients(readyClients);

  const [feedbackTarget, setFeedbackTarget] = useState<CompletionFeedbackTarget | null>(null);

  const handleOpenFeedback = (client: WeekResultsClientVM, cell: WeekResultsCellVM) =>
    setFeedbackTarget({
      clientUserId: client.clientUserId,
      displayName: client.displayName,
      dayNumber: cell.dayNumber,
      completionId: cell.completionId,
      resultText: cell.resultText,
      completedAtLabel: cell.completedAtLabel,
      comments: cell.comments,
    });

  if (analytics.isPending) return <WeekResultsSkeleton />;

  if (analytics.isError || availableWeeks.length === 0) {
    return <WeekResultsEmpty title={t('empty.noWeeksTitle')} description={t('empty.noWeeksDescription')} />;
  }

  const weekOptions = availableWeeks.map((value) => ({ value, label: t('weekLabel', { number: value }) }));

  return (
    <div className="flex flex-col gap-6">
      {config.status === 'ready' && config.clients.length > 0 && <WeekResultsSummary summary={config.summary} />}

      <WeekResultsToolbar
        weekOptions={weekOptions}
        week={week}
        onWeekChange={setWeek}
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
      />

      {config.status === 'loading' && <WeekResultsSkeleton />}

      {config.status === 'error' && (
        <div
          role="alert"
          className="border-border text-muted-foreground flex min-h-40 items-center justify-center rounded-md border border-dashed p-8 text-center"
        >
          <Typography variant="p-sm">{config.errorMessage}</Typography>
        </div>
      )}

      {config.status === 'empty' && (
        <WeekResultsEmpty title={t('empty.weekTitle')} description={t('empty.weekDescription')} />
      )}

      {config.status === 'ready' &&
        (config.clients.length === 0 ? (
          <WeekResultsEmpty title={t('empty.noClientsTitle')} description={t('empty.noClientsDescription')} />
        ) : visibleClients.length === 0 ? (
          <WeekResultsEmpty title={t('empty.noMatchesTitle')} description={t('empty.noMatchesDescription')} />
        ) : view === 'grid' ? (
          <WeekResultsCards
            dayNumbers={config.dayNumbers}
            selectedDay={resolveSelectedDay(config.dayNumbers, day)}
            clients={visibleClients}
            onSelectDay={setDay}
            onOpenFeedback={handleOpenFeedback}
          />
        ) : (
          <WeekResultsTable
            dayNumbers={config.dayNumbers}
            clients={visibleClients}
            onOpenFeedback={handleOpenFeedback}
          />
        ))}

      <CompletionFeedbackDialog
        programId={programId}
        weekNumber={week}
        target={feedbackTarget}
        onOpenChange={(open) => {
          if (!open) setFeedbackTarget(null);
        }}
      />
    </div>
  );
};
