'use client';

import { useLocale, usePathname, useRouter } from '@/i18n';

import { PROGRAM_WIZARD_STEPS } from '../ProgramWizardView.constants';
import type { ProgramWizardStep } from '../ProgramWizardView.types';
import { resolveStep } from '../ProgramWizardView.utils';

/**
 * Resolves the active step from the URL and exposes step navigation helpers.
 */
export const useWizardNavigation = (programId: string) => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const currentStep = resolveStep(pathname);
  const currentIndex = PROGRAM_WIZARD_STEPS.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === PROGRAM_WIZARD_STEPS.length - 1;

  const goToStep = (step: ProgramWizardStep, search = '') => {
    router.push(`/programs/${programId}/${step}${search}`, { locale });
  };

  const handleBack = () => {
    const previous = PROGRAM_WIZARD_STEPS[currentIndex - 1];
    if (previous) goToStep(previous);
  };

  const handleNext = () => {
    const next = PROGRAM_WIZARD_STEPS[currentIndex + 1];
    if (next) goToStep(next);
  };

  return {
    steps: PROGRAM_WIZARD_STEPS,
    currentStep,
    currentIndex,
    isFirstStep,
    isLastStep,
    goToStep,
    handleBack,
    handleNext,
  };
};
