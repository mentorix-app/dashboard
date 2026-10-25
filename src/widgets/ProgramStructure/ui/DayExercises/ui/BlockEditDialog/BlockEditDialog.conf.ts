'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { parseProgramBlockError, usePatchProgramDayBlock, useSetProgramDayBlockClients } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';
import { confirm } from '@/src/shared/ui';

import { useBlockVisibilityConfig } from '../../hooks/useBlockVisibilityConfig';
import { countExercisesLosingSets, getBlockTypeLabelKey } from '../../lib';
import type { BlockEditDialogProps, BlockEditValue } from './BlockEditDialog.types';
import { BLOCK_UPDATE_FAILED, buildBlockPatch, hasBlockChanges } from './BlockEditDialog.utils';

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

  const persist = async (value: BlockEditValue, clientUserIds: string[], metadataChanged: boolean) => {
    const visibilityChanged =
      clientUserIds.length !== block.clientUserIds.length ||
      clientUserIds.some((id) => !block.clientUserIds.includes(id));
    let failedStep: 'metadata' | 'visibility' = 'metadata';

    try {
      if (metadataChanged) {
        await patch.mutateAsync({ programId, weekId, blockId: block.id, ...buildBlockPatch(value) });
        setMetadataSaved(true);
      }
      failedStep = 'visibility';
      if (visibilityChanged) {
        await setClients.mutateAsync({ programId, weekId, blockId: block.id, clientUserIds });
      }
      showSuccessToast(t('structure.blocks.toast.blockUpdated'));
      handleOpenChange(false);
    } catch (error) {
      const errorCode = parseProgramBlockError(error);
      setErrorKey(failedStep === 'metadata' && errorCode === 'unknown' ? BLOCK_UPDATE_FAILED : errorCode);
    }
  };

  const handleSave = async (value: BlockEditValue) => {
    setErrorKey(null);
    const clientUserIds = await visibility.validateAndGetClientIds();
    if (clientUserIds === null) return;

    const metadataChanged = !metadataSaved && hasBlockChanges(block, value);
    // Any PATCH of a block type without sets makes the backend clear its exercises' sets.
    const setsToClear = metadataChanged ? countExercisesLosingSets(block, value.blockType) : 0;
    if (setsToClear === 0) {
      await persist(value, clientUserIds, metadataChanged);
      return;
    }

    confirm({
      title: t('structure.blocks.settings.clearSetsConfirm.title'),
      description: t('structure.blocks.settings.clearSetsConfirm.description', {
        count: setsToClear,
        type: t(getBlockTypeLabelKey(value.blockType)),
      }),
      cancelLabel: t('structure.blocks.settings.clearSetsConfirm.cancel'),
      confirmLabel: t('structure.blocks.settings.clearSetsConfirm.confirm'),
      variant: 'destructive',
      onConfirm: () => persist(value, clientUserIds, metadataChanged),
    });
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
