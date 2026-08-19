'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { parseProgramBlockError, usePatchProgramDayBlock, useSetProgramDayBlockClients } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { useBlockVisibilityConfig } from '../../hooks/useBlockVisibilityConfig';
import type { BlockEditDialogProps, BlockEditValue } from './BlockEditDialog.types';

export const useBlockEditDialogConfig = ({
  programId,
  weekId,
  block,
  isLastSharedBlock,
  open,
  onOpenChange,
}: BlockEditDialogProps) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast } = useToast();
  const patch = usePatchProgramDayBlock();
  const setClients = useSetProgramDayBlockClients();
  const visibility = useBlockVisibilityConfig({
    programId,
    open,
    initialClientUserIds: block.clientUserIds,
    isLastSharedBlock,
  });
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [metadataSaved, setMetadataSaved] = useState(false);
  const isPending = patch.isPending || setClients.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;
    if (!nextOpen) {
      setErrorKey(null);
      setMetadataSaved(false);
    }
    onOpenChange(nextOpen);
  };

  const handleSave = async (value: BlockEditValue) => {
    setErrorKey(null);
    const clientUserIds = await visibility.validateAndGetClientIds();
    if (clientUserIds === null) return;

    const metadataChanged =
      !metadataSaved && (value.blockType !== block.blockType || value.instruction !== block.instruction);
    const visibilityChanged =
      clientUserIds.length !== block.clientUserIds.length ||
      clientUserIds.some((id) => !block.clientUserIds.includes(id));

    try {
      if (metadataChanged) {
        await patch.mutateAsync({
          programId,
          weekId,
          blockId: block.id,
          blockType: value.blockType,
          instruction: value.instruction,
        });
        setMetadataSaved(true);
      }
      if (visibilityChanged) {
        await setClients.mutateAsync({ programId, weekId, blockId: block.id, clientUserIds });
      }
      showSuccessToast(t('structure.blocks.toast.blockUpdated'));
      onOpenChange(false);
    } catch (error) {
      setErrorKey(parseProgramBlockError(error));
    }
  };

  return {
    t,
    visibility,
    errorKey,
    metadataSaved,
    isPending,
    handleOpenChange,
    handleSave,
  };
};
