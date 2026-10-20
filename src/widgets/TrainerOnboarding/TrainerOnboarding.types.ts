import type { ONBOARDING_STEPS } from './TrainerOnboarding.constants';

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** Which translated message explains why the activation failed. */
export type ActivationErrorKey = 'admin' | 'notFound' | 'rateLimited' | 'unavailable' | 'unknown';
