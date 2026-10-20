'use client';

import { Loader2 } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { useTranslations } from '@/i18n';
import { needsTrainerActivation, useGetMe } from '@/src/entities/user';
import { useOnboardingStore } from '@/src/entities/onboarding';
import { Button, Typography } from '@/src/shared/ui';
import { AuthFooter } from '@/src/widgets/AuthFooter/AuthFooter';
import { TrainerOnboarding } from '@/src/widgets/TrainerOnboarding';

type TrainerGateProps = {
  children: ReactNode;
};

/**
 * Shows the cabinet to trainers and administrators. An account that has only the
 * `client` role (it signed in with Google or Apple) gets the onboarding instead,
 * where it can become a trainer. Roles come from `/auth/me`, so nothing of the
 * cabinet is rendered before they are known.
 */
export const TrainerGate: FC<TrainerGateProps> = ({ children }) => {
  const t = useTranslations('TrainerGate');
  const { data: user, isError, isFetching, refetch } = useGetMe();
  const onboardingActive = useOnboardingStore((state) => state.onboardingActive);

  if (user) {
    return needsTrainerActivation(user.roles) || onboardingActive ? <TrainerOnboarding /> : <>{children}</>;
  }

  if (isError) {
    return (
      <div className="flex min-h-svh flex-col">
        <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
          <Typography variant="h3">{t('errorTitle')}</Typography>
          <Typography variant="p-sm" className="text-muted-foreground">
            {t('errorDescription')}
          </Typography>
          <Button onClick={() => void refetch()} disabled={isFetching}>
            {t('retry')}
          </Button>
        </main>
        <AuthFooter />
      </div>
    );
  }

  return (
    <main role="status" className="flex min-h-svh items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden />
      <span className="sr-only">{t('loading')}</span>
    </main>
  );
};
