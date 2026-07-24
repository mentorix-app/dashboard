'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/ui';

import type { ClientTrainingConfig, ClientTrainingViewMode } from '../ClientTraining.types';
import { CompletionCalendar } from './CompletionCalendar/CompletionCalendar';
import { CompletionList } from './CompletionList';

type HistoryPanelProps = {
  config: ClientTrainingConfig;
  /** Fired when a completion is definitively picked (used to dismiss the mobile modal). */
  onPicked?: () => void;
};

export const HistoryPanel: FC<HistoryPanelProps> = ({ config, onPicked }) => {
  const t = useTranslations('ClientProfile');

  return (
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
        <CompletionList config={config} onPicked={onPicked} />
      </TabsContent>
      <TabsContent value="calendar" className="mt-4">
        <CompletionCalendar config={config} onPicked={onPicked} />
      </TabsContent>
    </Tabs>
  );
};
