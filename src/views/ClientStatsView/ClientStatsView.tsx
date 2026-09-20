'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { HtmlLangSync, Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/ui';

import { useClientStatsConfig } from './ClientStatsView.conf';
import type { ClientStatsViewProps } from './ClientStatsView.types';
import { ClientStatsActivity } from './ui/ClientStatsActivity';
import { ClientStatsCompletions } from './ui/ClientStatsCompletions';
import { ClientStatsError } from './ui/ClientStatsError';
import { ClientStatsHeader } from './ui/ClientStatsHeader';
import { ClientStatsProgress } from './ui/ClientStatsProgress';
import { ClientStatsSkeleton } from './ui/ClientStatsSkeleton';

export const ClientStatsView: FC<ClientStatsViewProps> = ({ linkParams }) => {
  const config = useClientStatsConfig(linkParams);
  const t = useTranslations('ClientStatsPage');

  return (
    <div className="bg-muted/30 min-h-svh">
      <HtmlLangSync />
      {config.state === 'loading' ? <ClientStatsSkeleton /> : null}
      {config.state === 'error' ? <ClientStatsError reason={config.reason} /> : null}
      {config.state === 'ready' ? (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
          <ClientStatsHeader analytics={config.data} />
          <Tabs defaultValue="progress" className="gap-4">
            <TabsList className="grid h-auto w-full grid-cols-3">
              <TabsTrigger value="progress" className="min-w-0 px-1 py-2 text-xs sm:text-sm">
                {t('tabs.progress')}
              </TabsTrigger>
              <TabsTrigger value="activity" className="min-w-0 px-1 py-2 text-xs sm:text-sm">
                {t('tabs.activity')}
              </TabsTrigger>
              <TabsTrigger value="history" className="min-w-0 px-1 py-2 text-xs sm:text-sm">
                {t('tabs.history')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="progress">
              <ClientStatsProgress assignment={config.data.currentAssignment} />
            </TabsContent>
            <TabsContent value="activity">
              <ClientStatsActivity activity={config.data.activity} />
            </TabsContent>
            <TabsContent value="history">
              <ClientStatsCompletions completions={config.data.recentCompletions} />
            </TabsContent>
          </Tabs>
        </main>
      ) : null}
    </div>
  );
};
