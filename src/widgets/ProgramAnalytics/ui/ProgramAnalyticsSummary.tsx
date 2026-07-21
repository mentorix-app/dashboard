'use client';

import { Info } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Card, Typography } from '@/src/shared/ui';

import type { ProgramAnalyticsSummaryVM } from '../ProgramAnalytics.types';

type ProgramAnalyticsSummaryProps = {
  summary: ProgramAnalyticsSummaryVM;
};

export const ProgramAnalyticsSummary = ({ summary }: ProgramAnalyticsSummaryProps) => {
  const t = useTranslations('ProgramAnalytics');

  const stats: { id: string; label: string; value: string; hint?: string }[] = [
    { id: 'activeClients', label: t('summary.activeClients'), value: String(summary.activeClients) },
    { id: 'totalCompletions', label: t('summary.totalCompletions'), value: String(summary.totalCompletions) },
    { id: 'last30Days', label: t('summary.last30Days'), value: String(summary.completionsLast30Days) },
    {
      id: 'avgCompletion',
      label: t('summary.avgCompletion'),
      value: summary.avgCompletionLabel,
      hint: t('summary.avgCompletionHint'),
    },
    { id: 'behindLatest', label: t('summary.behindLatest'), value: String(summary.behindLatestCount) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.id} className="gap-1 p-4">
          <dt className="text-muted-foreground flex items-center gap-1 text-xs">
            {stat.label}
            {stat.hint ? (
              <span title={stat.hint}>
                <Info className="size-3.5" aria-label={stat.hint} />
              </span>
            ) : null}
          </dt>
          <dd>
            <Typography variant="h3" className="tabular-nums">
              {stat.value}
            </Typography>
          </dd>
        </Card>
      ))}
    </dl>
  );
};
