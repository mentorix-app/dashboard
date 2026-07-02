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

  const handlePublish = () => {
    if (missingFields.length > 0) {
      setPublishAttempted(true);
      goToStep('basics', '?validate=1');
      return;
    }

    if (structureErrors.length > 0) {
      setPublishAttempted(true);
      goToStep('structure');
      return;
    }

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
    isPublishing: publishMutation.isPending,
    showMissingBanner: publishAttempted && missingFields.length > 0,
    showStructureBanner: publishAttempted && missingFields.length === 0 && structureErrors.length > 0,
  };
};
