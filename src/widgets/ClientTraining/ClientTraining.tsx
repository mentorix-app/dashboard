'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Card, Skeleton } from '@/src/shared/ui';

import { useClientTrainingConfig } from './ClientTraining.conf';
import type { ClientTrainingProps } from './ClientTraining.types';
import { CompletionDetail } from './ui/CompletionDetail/CompletionDetail';
import { HistoryNav } from './ui/HistoryNav';
import { ProgramOverview } from './ui/ProgramOverview/ProgramOverview';

export const ClientTraining: FC<ClientTrainingProps> = ({ clientUserId }) => {
  const t = useTranslations('ClientProfile');
  const config = useClientTrainingConfig(clientUserId);

  if (config.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-6 xl:grid-cols-[1fr_minmax(0,22rem)]">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (config.isError || !config.analytics) {
    return (
      <Card className="text-muted-foreground flex min-h-48 items-center justify-center p-6 text-center text-sm">
        {t('errors.generic')}
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_minmax(0,22rem)] xl:items-start">
      <div className="flex flex-col gap-6">
        <CompletionDetail clientUserId={clientUserId} completion={config.selected} />
        <ProgramOverview config={config} />
      </div>

      <HistoryNav config={config} />
    </div>
  );
};
