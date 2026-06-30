'use client';

import { useState } from 'react';
import { useTranslations } from '@/i18n';
import { useUpdateProgram, type UpdateProgramParams } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

/**
 * Owns the "save changes" confirmation modal and the patch mutation for an
 * already-published or archived program.
 */
export const useWizardSave = (programId: string, pendingPatch: UpdateProgramParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();
  const updateMutation = useUpdateProgram();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const confirmSaveChanges = () => {
    updateMutation.mutate(
      { id: programId, params: pendingPatch },
      {
        onSuccess: () => {
          setIsSaveModalOpen(false);
          showSuccessToast(t('toast.saveSuccess'));
        },
        onError: () => showErrorToast(t('toast.saveError')),
      }
    );
  };

  return {
    isSaveModalOpen,
    openSaveModal: () => setIsSaveModalOpen(true),
    setSaveModalOpen: setIsSaveModalOpen,
    confirmSaveChanges,
    isSaving: updateMutation.isPending,
  };
};
