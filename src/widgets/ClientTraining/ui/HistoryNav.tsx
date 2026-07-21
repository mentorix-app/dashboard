'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Card, Tabs, TabsContent, TabsList, TabsTrigger, Typography } from '@/src/shared/ui';

import type { ClientTrainingConfig, ClientTrainingViewMode } from '../ClientTraining.types';
import { CompletionCalendar } from './CompletionCalendar/CompletionCalendar';
import { CompletionList } from './CompletionList';

type HistoryNavProps = {
  config: ClientTrainingConfig;
};

export const HistoryNav: FC<HistoryNavProps> = ({ config }) => {
  const t = useTranslations('ClientProfile');

  return (
    <Card className="flex flex-col gap-4 p-4 xl:sticky xl:top-[calc(var(--app-header-height)+1.5rem)]">
      <Typography variant="h3">{t('history.heading')}</Typography>

      <Tabs value={config.viewMode} onValueChange={(value) => config.onViewModeChange(value as ClientTrainingViewMode)}>
        <TabsList className="w-full">
          <TabsTrigger value="list" className="flex-1">
            {t('history.list')}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex-1">
            {t('history.calendar')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <CompletionList config={config} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <CompletionCalendar config={config} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
