'use client';

import { useTranslations } from '@/i18n';
import type { PlanCode, PlanLimits } from '@/src/shared/types';
import { Badge, Card, CardContent, CardHeader, CardTitle, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib';

import { formatLimit } from '../../lib/formatLimit';

export type SubscriptionCardProps = {
  code: PlanCode;
  limits: PlanLimits;
  isCurrent?: boolean;
  className?: string;
};

export const SubscriptionCard = ({ code, limits, isCurrent = false, className }: SubscriptionCardProps) => {
  const t = useTranslations('Subscription');
  const unlimited = t('unlimited');

  const features = [
    { key: 'exercises', value: limits.exercises },
    { key: 'programs', value: limits.activePrograms },
    { key: 'clients', value: limits.activeClients },
  ] as const;

  return (
    <Card className={cn('flex flex-1 flex-col gap-4 p-6', isCurrent && 'border-primary border-2', className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-0">
        <CardTitle>
          <Typography variant="h3">{t(`plan.${code}`)}</Typography>
        </CardTitle>
        {isCurrent ? <Badge>{t('current')}</Badge> : null}
      </CardHeader>

      <CardContent className="p-0">
        <ul className="flex flex-col gap-2">
          {features.map(({ key, value }) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <Typography variant="p-sm" className="text-muted-foreground">
                {t(`features.${key}`)}
              </Typography>
              <Typography variant="p-sm" className="font-medium">
                {formatLimit(value, unlimited)}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
