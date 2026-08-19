'use client';

import type React from 'react';

import { CompletionFeedbackDialog } from '@/src/features/CompletionFeedbackDialog';
import { Typography } from '@/src/shared/ui';

import { useProgramWeekResultsConfig } from './ProgramWeekResults.conf';
import { WeekResultsCards } from './ui/WeekResultsCards';
import { WeekResultsEmpty } from './ui/WeekResultsEmpty';
import { WeekResultsSkeleton } from './ui/WeekResultsSkeleton';
import { WeekResultsSummary } from './ui/WeekResultsSummary';
import { WeekResultsTable } from './ui/WeekResultsTable';
import { WeekResultsToolbar } from './ui/WeekResultsToolbar';

type ProgramWeekResultsProps = {
  programId: string;
};

export const ProgramWeekResults: React.FC<ProgramWeekResultsProps> = ({ programId }) => {
  const config = useProgramWeekResultsConfig(programId);

  if (config.pageStatus === 'loading') return <WeekResultsSkeleton />;

  if (config.pageStatus === 'empty') {
    return <WeekResultsEmpty title={config.emptyCopy.noWeeksTitle} description={config.emptyCopy.noWeeksDescription} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {config.weekResults.status === 'ready' && config.weekResults.clients.length > 0 && (
        <WeekResultsSummary summary={config.weekResults.summary} />
      )}

      <WeekResultsToolbar
        weekOptions={config.weekOptions}
        week={config.state.week}
        onWeekChange={config.state.setWeek}
        view={config.state.view}
        onViewChange={config.state.setView}
        search={config.search}
        onSearchChange={config.handleSearchChange}
      />

      {config.weekResults.status === 'loading' && <WeekResultsSkeleton />}

      {config.weekResults.status === 'error' && (
        <div
          role="alert"
          className="border-border text-muted-foreground flex min-h-40 items-center justify-center rounded-md border border-dashed p-8 text-center"
        >
          <Typography variant="p-sm">{config.weekResults.errorMessage}</Typography>
        </div>
      )}

      {config.weekResults.status === 'empty' && (
        <WeekResultsEmpty title={config.emptyCopy.weekTitle} description={config.emptyCopy.weekDescription} />
      )}

      {config.weekResults.status === 'ready' &&
        (config.weekResults.clients.length === 0 ? (
          <WeekResultsEmpty
            title={config.emptyCopy.noClientsTitle}
            description={config.emptyCopy.noClientsDescription}
          />
        ) : config.visibleClients.length === 0 ? (
          <WeekResultsEmpty
            title={config.emptyCopy.noMatchesTitle}
            description={config.emptyCopy.noMatchesDescription}
          />
        ) : config.state.view === 'grid' ? (
          <WeekResultsCards
            dayNumbers={config.weekResults.dayNumbers}
            selectedDay={config.selectedDay}
            clients={config.visibleClients}
            onSelectDay={config.state.setDay}
            onOpenFeedback={config.handleOpenFeedback}
          />
        ) : (
          <WeekResultsTable
            dayNumbers={config.weekResults.dayNumbers}
            clients={config.visibleClients}
            onOpenFeedback={config.handleOpenFeedback}
          />
        ))}

      <CompletionFeedbackDialog
        programId={programId}
        weekNumber={config.state.week}
        target={config.feedbackTarget}
        onOpenChange={config.handleFeedbackOpenChange}
      />
    </div>
  );
};
