import { type FC } from 'react';
import { Link2Off } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Card, Logo, Typography } from '@/src/shared/ui';

import type { ClientStatsErrorReason } from '../ClientStatsView.types';

type ClientStatsErrorProps = {
  reason: ClientStatsErrorReason;
};

export const ClientStatsError: FC<ClientStatsErrorProps> = ({ reason }) => {
  const t = useTranslations('ClientStatsPage');

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg items-center px-4 py-8">
      <Card className="w-full items-center gap-5 p-6 text-center sm:p-8">
        <Logo />
        <span className="flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <Link2Off aria-hidden className="size-7" />
        </span>
        <div className="space-y-2">
          <Typography variant="h1">{t('errors.title')}</Typography>
          <p className="text-muted-foreground">{t(`errors.${reason}`)}</p>
        </div>
      </Card>
    </main>
  );
};
