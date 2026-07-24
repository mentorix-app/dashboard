'use client';

import { useTranslations } from '@/i18n';
import { Card, Progress, Typography } from '@/src/shared/ui';

import type { WeekResultsSummaryVM } from '../ProgramWeekResults.types';

type WeekResultsSummaryProps = {
  summary: WeekResultsSummaryVM;
};

export const WeekResultsSummary = ({ summary }: WeekResultsSummaryProps) => {
  const t = useTranslations('ProgramWeekResults');

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Card className="col-span-2 gap-2 p-4">
        <dt>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('summary.completion')}
          </Typography>
        </dt>
        <dd className="flex items-center gap-3">
          <Progress value={summary.completionPercent} className="h-2 flex-1" />
          <Typography variant="h3" className="tabular-nums">
            {summary.completionLabel}
          </Typography>
        </dd>
      </Card>

      <Card className="gap-2 p-4">
        <dt>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('summary.submitted')}
          </Typography>
        </dt>
        <dd>
          <Typography variant="h3" className="tabular-nums">
            {summary.submittedValue}
          </Typography>
        </dd>
      </Card>

      <Card className="gap-2 p-4">
        <dt>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('summary.missing')}
          </Typography>
        </dt>
        <dd>
          <Typography variant="h3" className="tabular-nums">
            {summary.missingValue}
          </Typography>
        </dd>
      </Card>

      <Card className="gap-2 p-4">
        <dt>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('summary.behind')}
          </Typography>
        </dt>
        <dd>
          <Typography variant="h3" className="tabular-nums">
            {summary.behindValue}
          </Typography>
        </dd>
      </Card>
    </dl>
  );
};
