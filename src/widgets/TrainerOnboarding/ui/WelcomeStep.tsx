'use client';

import { Check } from 'lucide-react';
import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Button } from '@/src/shared/ui';
import { WELCOME_POINTS } from '../TrainerOnboarding.constants';

type WelcomeStepProps = {
  isSigningOut: boolean;
  onContinue: () => void;
  onSignOut: () => void;
};

export const WelcomeStep: FC<WelcomeStepProps> = ({ isSigningOut, onContinue, onSignOut }) => {
  const t = useTranslations('TrainerOnboarding');

  return (
    <>
      <ul className="flex flex-col gap-3 text-sm">
        {WELCOME_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
            {t(`welcome.points.${point}`)}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={onSignOut} disabled={isSigningOut}>
          {t('signOut')}
        </Button>
        <Button onClick={onContinue}>{t('next')}</Button>
      </div>
    </>
  );
};
