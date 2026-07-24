'use client';

import { Typography } from '@/src/shared/ui';

import { useProgramAnalyticsConfig } from './ProgramAnalytics.conf';
import { ProgramAnalyticsClients } from './ui/ProgramAnalyticsClients';
import { ProgramAnalyticsSkeleton } from './ui/ProgramAnalyticsSkeleton';
import { ProgramAnalyticsSummary } from './ui/ProgramAnalyticsSummary';
import { WeeklyDropOff } from './ui/WeeklyDropOff';

type ProgramAnalyticsProps = {
  programId: string;
};

export const ProgramAnalytics = ({ programId }: ProgramAnalyticsProps) => {
  const config = useProgramAnalyticsConfig(programId);

  if (config.status === 'loading') return <ProgramAnalyticsSkeleton />;

  if (config.status === 'error') {
    return (
      <div
        role="alert"
        className="border-border text-muted-foreground flex min-h-40 items-center justify-center rounded-md border border-dashed p-8 text-center"
      >
        <Typography variant="p-sm">{config.errorMessage}</Typography>
      </div>
    );
  }

  const { summary, chartConfig, chartData, clients } = config;

  return (
    <div className="flex flex-col gap-6">
      <ProgramAnalyticsSummary summary={summary} />
      <WeeklyDropOff chartConfig={chartConfig} chartData={chartData} />
      <ProgramAnalyticsClients clients={clients} />
    </div>
  );
};
