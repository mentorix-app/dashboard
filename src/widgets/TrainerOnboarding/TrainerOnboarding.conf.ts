'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, useTransition } from 'react';

import { logoutAction } from '@/src/entities/auth';
import { useOnboardingStore } from '@/src/entities/onboarding';
import { useActivateTrainer, type User } from '@/src/entities/user';
import { queryKeys } from '@/src/shared/api';
import { ONBOARDING_STEPS, TRAINER_TERMS_VERSION } from './TrainerOnboarding.constants';
import { getActivationErrorKey } from './TrainerOnboarding.utils';

const LAST_STEP = ONBOARDING_STEPS.length - 1;

export const useTrainerOnboardingConfig = () => {
  const queryClient = useQueryClient();
  const requestTour = useOnboardingStore((state) => state.requestTour);
  const beginOnboarding = useOnboardingStore((state) => state.beginOnboarding);
  const endOnboarding = useOnboardingStore((state) => state.endOnboarding);
  const activate = useActivateTrainer();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [activatedUser, setActivatedUser] = useState<User | null>(null);
  const [isSigningOut, startSignOut] = useTransition();

  // Tells the gate to keep this screen even after `/auth/me` starts reporting the trainer role.
  useEffect(() => {
    beginOnboarding();
    return endOnboarding;
  }, [beginOnboarding, endOnboarding]);

  // Move focus to the new step's heading so keyboard and screen-reader users follow the flow.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const handleContinue = () => setStepIndex((index) => Math.min(index + 1, LAST_STEP));

  const handleAccept = () => {
    activate.mutate(
      { termsVersion: TRAINER_TERMS_VERSION },
      {
        onSuccess: (user) => {
          setActivatedUser(user);
          handleContinue();
        },
      }
    );
  };

  // The profile goes into the cache only now: it makes the gate show the cabinet,
  // so the last step stays on screen until the person leaves it. The tour starts by itself there.
  const handleFinish = () => {
    if (!activatedUser) return;
    requestTour();
    endOnboarding();
    queryClient.setQueriesData<User>({ queryKey: queryKeys.user.me() }, activatedUser);
  };

  const handleSignOut = () => {
    startSignOut(async () => {
      await logoutAction();
    });
  };

  return {
    headingRef,
    step: ONBOARDING_STEPS[stepIndex] ?? ONBOARDING_STEPS[0],
    stepIndex,
    stepCount: ONBOARDING_STEPS.length,
    accepted,
    isActivating: activate.isPending,
    isSigningOut,
    errorKey: activate.error ? getActivationErrorKey(activate.error) : null,
    onAcceptedChange: setAccepted,
    onContinue: handleContinue,
    onAccept: handleAccept,
    onFinish: handleFinish,
    onSignOut: handleSignOut,
  };
};
