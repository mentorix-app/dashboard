'use client';

import { type FC } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { useTranslations } from '@/i18n';
import { formatDate } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';
import {
  Badge,
  Card,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Typography,
} from '@/src/shared/ui';

import { REVIEW_STATUS_META, REVIEW_STATUS_ORDER } from '../../ClientTraining.constants';
import type { ClientTrainingConfig } from '../../ClientTraining.types';
import { pickText } from '../../ClientTraining.utils';
import { useProgramOverviewConfig } from './ProgramOverview.conf';

type ProgramOverviewProps = {
  config: ClientTrainingConfig;
};

export const ProgramOverview: FC<ProgramOverviewProps> = ({ config }) => {
  const t = useTranslations('ClientProfile');
  const { locale, analytics, statusCounts } = config;
  const { chartConfig, chartData, activityStats, firstCompletedAt } = useProgramOverviewConfig(config);

  const assignment = analytics?.currentAssignment ?? null;

  return (
    <Card className="flex flex-col gap-5 p-6">
      <header className="flex flex-col gap-3">
        <Typography variant="h3">{t('overview.heading')}</Typography>

        {assignment ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Typography variant="p" className="font-medium">
                {pickText(locale, assignment.programName, assignment.programNameRu)}
              </Typography>
              {assignment.isBehindLatest ? (
                <Badge
                  variant="outline"
                  size="sm"
                  className="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                >
                  {t('overview.behindLatest')}
                </Badge>
              ) : null}
            </div>
            <span className="text-muted-foreground text-sm tabular-nums">
              {t('overview.completion', { percent: assignment.progress.completionPercent })}
            </span>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{t('overview.noProgram')}</p>
        )}
      </header>

      {statusCounts ? (
        <ul className="flex flex-wrap gap-4">
          {REVIEW_STATUS_ORDER.map((key) => {
            const meta = REVIEW_STATUS_META[key];
            return (
              <li key={key} className="flex items-center gap-1.5 text-sm">
                <span className={cn('size-2.5 rounded-full', meta.dot)} aria-hidden />
                <span className={meta.text}>{t(`statusCounts.${key}`)}</span>
                <span className="font-semibold tabular-nums">{statusCounts[key]}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {chartData.length > 0 ? (
        <section className="flex flex-col gap-2">
          <Typography variant="p-sm" className="text-muted-foreground font-medium">
            {t('overview.weeklyHeading')}
          </Typography>
          <ChartContainer config={chartConfig} className="max-h-56 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="completed" stackId="week" fill="var(--color-completed)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="remaining" stackId="week" fill="var(--color-remaining)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </section>
      ) : null}

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {activityStats.map((stat) => (
          <div key={stat.id} className="bg-muted/40 flex flex-col gap-1 rounded-lg p-3">
            <dt className="text-muted-foreground text-xs">{stat.label}</dt>
            <dd className="text-2xl font-semibold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {firstCompletedAt ? (
        <p className="text-muted-foreground text-xs">
          {t('activity.heading', { first: formatDate(firstCompletedAt, locale, 'longDate') })}
        </p>
      ) : null}
    </Card>
  );
};
