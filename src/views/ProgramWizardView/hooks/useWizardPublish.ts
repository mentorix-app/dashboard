'use client';

import { useState } from 'react';
import { useLocale, useRouter, useTranslations } from '@/i18n';
import { usePublishProgram } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import type { ProgramRequiredField, ProgramWizardStep, StructureErrorKey } from '../ProgramWizardView.types';

/**
 * Owns the publish flow: routes back to step 1 with the validation flag when
 * required fields are missing, keeps the user on the structure step when the
 * program layout is incomplete, otherwise publishes and returns to the list.
 */
export const useWizardPublish = (
  programId: string,
  missingFields: ProgramRequiredField[],
  structureErrors: StructureErrorKey[],
  goToStep: (step: ProgramWizardStep, search?: string) => void
) => {
  const t = useTranslations('ProgramWizard');
  const router = useRouter();
  const locale = useLocale();
  const { showSuccessToast, showErrorToast } = useToast();
  const publishMutation = usePublishProgram();
  const [publishAttempted, setPublishAttempted] = useState(false);

  /**
   * Runs the same client-side gate the draft publish uses: routes to the first
   * failing step and flips the banner flag. Returns true only when the program
   * is publishable. Shared with the header's publish-update action so it shows
   * inline validation instead of a server-error toast.
   */
  const validateBeforePublish = (): boolean => {
    if (missingFields.length > 0) {
      setPublishAttempted(true);
      goToStep('basics', '?validate=1');
      return false;
    }

    if (structureErrors.length > 0) {
      setPublishAttempted(true);
      goToStep('structure');
      return false;
    }

    return true;
  };

  const handlePublish = () => {
    if (!validateBeforePublish()) return;

    publishMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('toast.publishSuccess'));
        router.push('/programs', { locale });
      },
      onError: () => showErrorToast(t('toast.publishError')),
    });
  };

  return {
    handlePublish,
    validateBeforePublish,
    isPublishing: publishMutation.isPending,
    showMissingBanner: publishAttempted && missingFields.length > 0,
    showStructureBanner: publishAttempted && missingFields.length === 0 && structureErrors.length > 0,
  };
};
