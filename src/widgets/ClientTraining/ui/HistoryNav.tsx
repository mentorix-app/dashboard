'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Card, Typography } from '@/src/shared/ui';

import type { ClientTrainingConfig } from '../ClientTraining.types';
import { HistoryPanel } from './HistoryPanel';

type HistoryNavProps = {
  config: ClientTrainingConfig;
};

export const HistoryNav: FC<HistoryNavProps> = ({ config }) => {
  const t = useTranslations('ClientProfile');

  return (
    <Card className="flex flex-col gap-4 p-4 xl:sticky xl:top-[calc(var(--app-header-height)+1.5rem)]">
      <Typography variant="h3">{t('history.heading')}</Typography>
      <HistoryPanel config={config} />
    </Card>
  );
};
