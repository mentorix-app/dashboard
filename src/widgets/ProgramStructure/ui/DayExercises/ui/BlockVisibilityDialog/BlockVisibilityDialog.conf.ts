'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { parseProgramBlockError, useSetProgramDayBlockClients } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { useBlockVisibilityConfig } from '../../hooks/useBlockVisibilityConfig';
import type { BlockVisibilityDialogProps } from './BlockVisibilityDialog.types';

export const useBlockVisibilityDialogConfig = ({
  programId,
  weekId,
  block,
  isLastSharedBlock,
  open,
  onOpenChange,
}: BlockVisibilityDialogProps) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast } = useToast();
  const mutation = useSetProgramDayBlockClients();
  const visibility = useBlockVisibilityConfig({
    programId,
    open,
    initialClientUserIds: block.clientUserIds,
    isLastSharedBlock,
  });
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return;
    if (!nextOpen) setErrorKey(null);
    onOpenChange(nextOpen);
  };

  const handleSave = async () => {
    setErrorKey(null);
    const clientUserIds = await visibility.validateAndGetClientIds();
    if (clientUserIds === null) return;

    try {
      await mutation.mutateAsync({ programId, weekId, blockId: block.id, clientUserIds });
      showSuccessToast(t('structure.blocks.visibility.saved'));
      onOpenChange(false);
    } catch (error) {
      setErrorKey(parseProgramBlockError(error));
    }
  };

  return {
    t,
    visibility,
    errorKey,
    isPending: mutation.isPending,
    handleOpenChange,
    handleSave,
  };
};
