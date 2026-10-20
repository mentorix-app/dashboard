'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@/src/shared/ui';
import { AuthFooter } from '@/src/widgets/AuthFooter/AuthFooter';
import { useTrainerOnboardingConfig } from './TrainerOnboarding.conf';
import { HowItWorksStep } from './ui/HowItWorksStep';
import { TermsStep } from './ui/TermsStep';
import { WelcomeStep } from './ui/WelcomeStep';

/** Full-screen first-run flow for a signed-in account that is not a trainer yet. */
export const TrainerOnboarding: FC = () => {
  const t = useTranslations('TrainerOnboarding');
  const {
    headingRef,
    step,
    stepIndex,
    stepCount,
    accepted,
    isActivating,
    isSigningOut,
    errorKey,
    onAcceptedChange,
    onContinue,
    onAccept,
    onFinish,
    onSignOut,
  } = useTrainerOnboardingConfig();

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <p className="text-muted-foreground text-xs" aria-live="polite">
              {t('stepLabel', { current: stepIndex + 1, total: stepCount })}
            </p>
            <Progress value={((stepIndex + 1) / stepCount) * 100} label={t('progressLabel')} className="h-1.5" />
            <CardTitle className="mt-2">
              <h1 ref={headingRef} tabIndex={-1} className="text-2xl leading-tight outline-none">
                {t(`${step}.title`)}
              </h1>
            </CardTitle>
            <CardDescription>{t(`${step}.description`)}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'welcome' && (
              <WelcomeStep isSigningOut={isSigningOut} onContinue={onContinue} onSignOut={onSignOut} />
            )}
            {step === 'terms' && (
              <TermsStep
                accepted={accepted}
                errorKey={errorKey}
                isActivating={isActivating}
                isSigningOut={isSigningOut}
                onAcceptedChange={onAcceptedChange}
                onAccept={onAccept}
                onSignOut={onSignOut}
              />
            )}
            {step === 'howItWorks' && <HowItWorksStep onFinish={onFinish} />}
          </CardContent>
        </Card>
      </main>
      <AuthFooter />
    </div>
  );
};
