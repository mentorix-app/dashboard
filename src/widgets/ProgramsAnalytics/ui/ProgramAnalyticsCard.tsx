'use client';

import { ArrowUpRight } from 'lucide-react';

import { Link, useTranslations } from '@/i18n';
import { ProgramStatusBadge } from '@/src/entities/program';
import { cn } from '@/src/shared/lib/styles';
import { Card, CardContent, CardHeader, CardTitle, Progress, Typography } from '@/src/shared/ui';

import type { ProgramAnalyticsCardVM } from '../ProgramsAnalytics.types';

type ProgramAnalyticsCardProps = {
  card: ProgramAnalyticsCardVM;
};

export const ProgramAnalyticsCard = ({ card }: ProgramAnalyticsCardProps) => {
  const t = useTranslations('ProgramsAnalytics');

  const stats: { id: string; label: string; value: number }[] = [
    { id: 'activeClients', label: t('metrics.activeClients'), value: card.activeClients },
    { id: 'totalCompletions', label: t('metrics.totalCompletions'), value: card.totalCompletions },
    { id: 'last30Days', label: t('metrics.last30Days'), value: card.completionsLast30Days },
  ];

  const body = (
    <Card className={cn('h-full gap-4 py-4', card.href && 'group-hover:border-primary/50 transition-colors')}>
      <CardHeader className="gap-2 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 leading-snug break-words">{card.name}</CardTitle>
          {card.href ? <ArrowUpRight className="text-muted-foreground size-4 shrink-0" aria-hidden /> : null}
        </div>
        <div>
          <ProgramStatusBadge status={card.status} label={card.statusLabel} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-4">
        <dl className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-1">
              <dt className="text-muted-foreground line-clamp-2 min-h-8 text-xs leading-4">{stat.label}</dt>
              <dd className="text-xl font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Typography variant="p-xs" className="text-muted-foreground">
              {t('metrics.avgCompletion')}
            </Typography>
            <span className="text-sm font-medium tabular-nums">{card.avgCompletionLabel}</span>
          </div>
          <Progress value={card.avgCompletionPercent ?? 0} aria-hidden />
        </div>

        <Typography variant="p-xs" className="text-muted-foreground">
          {t('metrics.lastActivity', { date: card.lastActivityLabel })}
        </Typography>
      </CardContent>
    </Card>
  );

  if (!card.href) {
    return body;
  }

  return (
    <Link
      href={card.href}
      aria-label={t('openCard', { name: card.name })}
      className="focus-visible:ring-ring group rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      {body}
    </Link>
  );
};
