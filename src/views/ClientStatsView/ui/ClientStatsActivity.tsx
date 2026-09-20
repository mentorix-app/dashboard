import { type FC, type ReactNode } from 'react';
import { Activity, CalendarCheck2, CalendarDays, Flame } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { AnalyticsActivity } from '@/src/entities/analytics';
import { Card, Typography } from '@/src/shared/ui';

type ClientStatsActivityProps = {
  activity: AnalyticsActivity;
};

export const ClientStatsActivity: FC<ClientStatsActivityProps> = ({ activity }) => {
  const t = useTranslations('ClientStatsPage');
  const items: { id: string; label: string; value: number; icon: ReactNode }[] = [
    { id: 'total', label: t('activity.total'), value: activity.totalCompletions, icon: <Activity /> },
    { id: 'week', label: t('activity.last7'), value: activity.completionsLast7Days, icon: <CalendarCheck2 /> },
    { id: 'month', label: t('activity.last30'), value: activity.completionsLast30Days, icon: <CalendarDays /> },
    { id: 'streak', label: t('activity.streak'), value: activity.weekStreak, icon: <Flame /> },
  ];

  return (
    <section aria-labelledby="activity-heading" className="space-y-3">
      <Typography id="activity-heading" variant="h2">
        {t('activity.heading')}
      </Typography>
      <dl className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Card key={item.id} className="gap-3 p-4 shadow-none">
            <div className="text-emerald-700 dark:text-emerald-300 [&_svg]:size-5">{item.icon}</div>
            <dd className="text-2xl font-bold tabular-nums">{item.value}</dd>
            <dt className="text-muted-foreground text-sm leading-snug">{item.label}</dt>
          </Card>
        ))}
      </dl>
    </section>
  );
};
