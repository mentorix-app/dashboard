'use client';

import { BarChart3, Dumbbell, Table2, Users, type LucideIcon } from 'lucide-react';

import { Link, useTranslations } from '@/i18n';
import { useCurrentUser } from '@/src/entities/user';
import { tourTarget } from '@/src/features/ProductTour';
import { ROUTES } from '@/src/shared/lib';
import { Card, CardDescription, CardHeader, CardTitle, Typography } from '@/src/shared/ui';

type DashboardCard = {
  key: 'exercises' | 'programs' | 'clients' | 'analytics';
  href: string;
  icon: LucideIcon;
};

const dashboardCards: readonly DashboardCard[] = [
  { key: 'exercises', href: ROUTES.exercises, icon: Dumbbell },
  { key: 'programs', href: ROUTES.programs, icon: Table2 },
  { key: 'clients', href: ROUTES.clients, icon: Users },
  { key: 'analytics', href: ROUTES.analytics, icon: BarChart3 },
];

export const DashboardView = () => {
  const t = useTranslations('Dashboard');
  const user = useCurrentUser();

  const displayName = user?.name ?? user?.firstName;

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography variant="h1">{t('title')}</Typography>
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('subtitle')}
        </Typography>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4" as="span">
                {displayName ? t('greeting.title', { name: displayName }) : t('greeting.titleFallback')}
              </Typography>
            </CardTitle>
            <CardDescription>{t('greeting.description')}</CardDescription>
            {user && (
              <Link href={ROUTES.user(user.userId)} className="text-primary text-sm font-medium hover:underline">
                {t('greeting.cta')}
              </Link>
            )}
          </CardHeader>
        </Card>

        {dashboardCards.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            {...tourTarget(`card-${key}`)}
            className="focus-visible:ring-ring group rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <Card className="group-hover:border-primary/50 h-full transition-colors">
              <CardHeader>
                <Icon className="text-primary mb-2 size-6" aria-hidden />
                <CardTitle>
                  <Typography variant="h4" as="span">
                    {t(`cards.${key}.title`)}
                  </Typography>
                </CardTitle>
                <CardDescription>{t(`cards.${key}.description`)}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
