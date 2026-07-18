'use client';

import { useLocale, useRouter, useTranslations } from '@/i18n';
import { ProgramStatus, canManageProgram, useProgram } from '@/src/entities/program';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { ROUTES } from '@/src/shared/lib';

import { useWizardDraft } from './hooks/useWizardDraft';
import { useWizardNavigation } from './hooks/useWizardNavigation';
import { useWizardPublish } from './hooks/useWizardPublish';

export const useProgramWizardConfig = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const router = useRouter();
  const locale = useLocale();
  const { data: program, isLoading: isProgramLoading } = useProgram(programId);
  const { isTrainer } = useCapabilities();
  const currentUser = useCurrentUser();

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
  // Admins are read-only for programs; only the owning trainer can publish.
  const canManage = !!program && canManageProgram(program, { isTrainer, userId: currentUser?.userId });
  const handleDone = () => router.push(ROUTES.programs, { locale });

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
    canManage,
    title,
    progressText,
    showMissingBanner: publish.showMissingBanner,
    showStructureBanner: publish.showStructureBanner,
    isPublishing: publish.isPublishing,
    goToStep: navigation.goToStep,
    handleBack: navigation.handleBack,
    handleNext: navigation.handleNext,
    handlePublish: publish.handlePublish,
    handleDone,
    validateBeforePublish: publish.validateBeforePublish,
  };
};
