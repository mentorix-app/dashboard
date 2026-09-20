import { type FC } from 'react';
import { Dumbbell, UserRound } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useTranslations } from '@/i18n';
import type { ClientSelfAnalytics } from '@/src/entities/analytics';
import { LanguageSwitcher } from '@/src/features/LanguageSwitcher/LanguageSwitcher';
import { Card, Logo, Typography } from '@/src/shared/ui';

import { pickLocalizedName } from '../ClientStatsView.utils';
import { ClientStatsExpiryTimer } from './ClientStatsExpiryTimer';

type ClientStatsHeaderProps = {
  analytics: ClientSelfAnalytics;
};

export const ClientStatsHeader: FC<ClientStatsHeaderProps> = ({ analytics }) => {
  const locale = useLocale();
  const t = useTranslations('ClientStatsPage');

  return (
    <Card className="overflow-hidden border-0 bg-emerald-950 py-0 text-white shadow-lg">
      <div className="flex flex-col gap-7 px-5 py-6 sm:px-7 sm:py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Logo showWordmark={false} className="size-6" ariaLabel="Mentorix" />
            </span>
            <span className="truncate text-lg font-bold">Mentorix</span>
          </div>
          <LanguageSwitcher compact inverse />
        </div>
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lime-300 text-emerald-950">
            <UserRound aria-hidden className="size-6" />
          </span>
          <div className="min-w-0">
            <Typography as="p" variant="p-sm" className="text-emerald-100">
              {t('header.greeting')}
            </Typography>
            <Typography variant="h1" className="wrap-break-word text-white">
              {analytics.client.displayName}
            </Typography>
            <p className="mt-2 text-sm text-emerald-100">
              {t('header.trainer', { name: analytics.trainer.displayName })}
            </p>
          </div>
        </div>
        {analytics.currentAssignment ? (
          <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3">
            <Dumbbell aria-hidden className="size-5 shrink-0 text-lime-300" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-emerald-100">{t('header.currentProgram')}</p>
              <p className="truncate font-semibold">
                {pickLocalizedName(
                  locale,
                  analytics.currentAssignment.programName,
                  analytics.currentAssignment.programNameRu
                )}
              </p>
            </div>
          </div>
        ) : null}
        <div className="border-t border-white/15 pt-4 [&_p]:text-emerald-100">
          <ClientStatsExpiryTimer expiresAt={analytics.expiresAt} />
        </div>
      </div>
    </Card>
  );
};
