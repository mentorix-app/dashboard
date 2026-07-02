'use client';

import { useTranslations } from '@/i18n';
import { ProgramStatus, useProgram } from '@/src/entities/program';

import { useWizardDraft } from './hooks/useWizardDraft';
import { useWizardNavigation } from './hooks/useWizardNavigation';
import { useWizardPublish } from './hooks/useWizardPublish';

export const useProgramWizardConfig = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const { data: program, isLoading: isProgramLoading } = useProgram(programId);

  const navigation = useWizardNavigation(programId);
  const draft = useWizardDraft(programId, program);
  const publish = useWizardPublish(programId, draft.missingFields, draft.structureErrors, navigation.goToStep);

  const progressText = t('progress', {
    current: navigation.currentIndex + 1,
    total: navigation.steps.length,
    percent: draft.completionPercent,
  });
  const title = t('title', { name: draft.displayName || t('titleUntitled') });
  const isArchived = draft.status === ProgramStatus.Archived;

  return {
    t,
    steps: navigation.steps,
    currentIndex: navigation.currentIndex,
    isFirstStep: navigation.isFirstStep,
    isLastStep: navigation.isLastStep,
    isLoading: isProgramLoading && !program,
    completionPercent: draft.completionPercent,
    missingFields: draft.missingFields,
    structureErrors: draft.structureErrors,
    status: draft.status,
    isDraft: draft.isDraft,
    isArchived,
    title,
    progressText,
    showMissingBanner: publish.showMissingBanner,
    showStructureBanner: publish.showStructureBanner,
    isPublishing: publish.isPublishing,
    goToStep: navigation.goToStep,
    handleBack: navigation.handleBack,
    handleNext: navigation.handleNext,
    handlePublish: publish.handlePublish,
  };
};
