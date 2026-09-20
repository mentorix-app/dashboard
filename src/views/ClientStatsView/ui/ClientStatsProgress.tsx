import { type FC } from 'react';
import { Dumbbell } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useTranslations } from '@/i18n';
import type { AnalyticsAssignment } from '@/src/entities/analytics';
import { Badge, Card, Progress, Typography } from '@/src/shared/ui';

import { pickLocalizedName } from '../ClientStatsView.utils';

type ClientStatsProgressProps = {
  assignment: AnalyticsAssignment | null;
};

export const ClientStatsProgress: FC<ClientStatsProgressProps> = ({ assignment }) => {
  const locale = useLocale();
  const t = useTranslations('ClientStatsPage');

  if (!assignment) {
    return (
      <Card className="gap-3 p-5">
        <Dumbbell aria-hidden className="text-muted-foreground size-6" />
        <p className="text-muted-foreground text-sm">{t('progress.noProgram')}</p>
      </Card>
    );
  }

  const { progress } = assignment;

  return (
    <section aria-label={t('progress.progressLabel')}>
      <Card className="gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-semibold uppercase">{t('progress.activeProgram')}</p>
            <Typography variant="h3" className="mt-1 wrap-break-word">
              {pickLocalizedName(locale, assignment.programName, assignment.programNameRu)}
            </Typography>
          </div>
          <span className="text-2xl font-bold tabular-nums">{progress.completionPercent}%</span>
        </div>
        {assignment.isBehindLatest ? <Badge variant="secondary">{t('progress.behindLatest')}</Badge> : null}
        <Progress value={progress.completionPercent} label={t('progress.progressLabel')} className="h-3" />
        <p className="text-muted-foreground text-sm">
          {t('progress.completedDays', { completed: progress.completedDays, total: progress.totalTrainingDays })}
        </p>
        {progress.weeks.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {progress.weeks.map((week) => (
              <div key={week.weekNumber} className="bg-muted/60 rounded-lg px-3 py-2.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{t('progress.week', { number: week.weekNumber })}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {week.completedDays}/{week.totalDays}
                  </span>
                </div>
                <Progress
                  value={week.totalDays > 0 ? (week.completedDays / week.totalDays) * 100 : 0}
                  label={t('progress.weekProgress', { number: week.weekNumber })}
                />
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </section>
  );
};
