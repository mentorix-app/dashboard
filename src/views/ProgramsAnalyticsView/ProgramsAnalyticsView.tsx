'use client';

import { useEffect } from 'react';

import { useRouter, useTranslations } from '@/i18n';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';
import { Typography } from '@/src/shared/ui';
import { ProgramsAnalytics } from '@/src/widgets/ProgramsAnalytics';

export const ProgramsAnalyticsView = () => {
  const t = useTranslations('ProgramsAnalytics');
  const router = useRouter();
  const user = useCurrentUser();
  const { isTrainer, isAdmin } = useCapabilities();

  const canViewAnalytics = isTrainer || isAdmin;

  useEffect(() => {
    if (user && !canViewAnalytics) router.replace(ROUTES.dashboard);
  }, [user, canViewAnalytics, router]);

  if (!user || !canViewAnalytics) return null;

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography variant="h1">{t('title')}</Typography>
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('subtitle')}
        </Typography>
      </div>
      <ProgramsAnalytics />
    </section>
  );
};
