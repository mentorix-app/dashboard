import { useTranslations } from '@/i18n';

import { Typography } from '@/src/shared/ui';
import { DashboardOverviewCard } from '@/src/widgets/DashboardOverviewCard/DashboardOverviewCard';

export const Dashboard = () => {
  const t = useTranslations('Dashboard');

  return (
    <section className="flex flex-1 flex-col gap-6">
      <Typography variant="h1">{t('title')}</Typography>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardOverviewCard />
      </div>
    </section>
  );
};
