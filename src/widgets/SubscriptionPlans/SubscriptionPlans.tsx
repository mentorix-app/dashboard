'use client';

import { useTranslations } from '@/i18n';
import { SubscriptionCard } from '@/src/entities/subscription';
import { Card, Skeleton, Typography } from '@/src/shared/ui';

import { useSubscriptionPlansConfig } from './SubscriptionPlans.conf';

export const SubscriptionPlans = () => {
  const t = useTranslations('Profile');
  const { plans, currentPlan, isLoading } = useSubscriptionPlansConfig();

  return (
    <Card className="flex flex-col gap-4 p-6">
      <Typography variant="h3">{t('plansHeading')}</Typography>

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading
          ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-44 w-full" />)
          : plans.map((plan) => (
              <SubscriptionCard
                key={plan.code}
                code={plan.code}
                limits={plan.limits}
                isCurrent={plan.code === currentPlan}
              />
            ))}
      </div>
    </Card>
  );
};
