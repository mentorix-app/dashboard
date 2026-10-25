'use client';

import { useTranslations } from '@/i18n';
import {
  parseProgramBlockError,
  useCopyProgramDayBlock,
  useDeleteProgramDayBlock,
  useMergeProgramDayBlocks,
  useMoveProgramDayBlock,
  useReorderProgramBlockExercises,
  useReorderProgramDayBlocks,
  useUngroupProgramDayBlock,
} from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

type UseDayBlockActionsParams = {
  programId: string;
  weekId: string;
  dayId: string;
};

/**
 * Block-level mutations for the selected day: grouping singles, ungrouping/
 * deleting groups, reordering (blocks and grouped exercises), moving a whole
 * block to another day of the week and copying it to any day of the program.
 * Every response rewrites the program. Editing a group lives in its dialog.
 */
export const useDayBlockActions = ({ programId, weekId, dayId }: UseDayBlockActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const merge = useMergeProgramDayBlocks();
  const ungroup = useUngroupProgramDayBlock();
  const remove = useDeleteProgramDayBlock();
  const reorderBlocks = useReorderProgramDayBlocks();
  const reorderExercises = useReorderProgramBlockExercises();
  const moveBlock = useMoveProgramDayBlock();
  const copyBlock = useCopyProgramDayBlock();

  const handleMerge = (blockIds: string[]) => {
    if (blockIds.length < 2) return;
    merge.mutate(
      { programId, weekId, dayId, blockIds },
      {
        onSuccess: () => showSuccessToast(t('structure.blocks.toast.blocksMerged')),
        onError: () => showErrorToast(t('structure.blocks.toast.mergeError')),
      }
    );
  };

  const handleUngroupBlock = (blockId: string) => {
    ungroup.mutate(
      { programId, weekId, blockId },
      {
        onSuccess: () => showSuccessToast(t('structure.blocks.toast.blockUngrouped')),
        onError: () => showErrorToast(t('structure.blocks.toast.ungroupError')),
      }
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    remove.mutate(
      { programId, weekId, blockId },
      {
        onSuccess: () => showSuccessToast(t('structure.blocks.toast.blockDeleted')),
        onError: () => showErrorToast(t('structure.blocks.toast.blockDeleteError')),
      }
    );
  };

  const handleReorderBlocks = (blockIds: string[]) => {
    reorderBlocks.mutate(
      { programId, weekId, dayId, blockIds },
      {
        onSuccess: () => showSuccessToast(t('structure.blocks.toast.blocksReordered')),
        onError: () => showErrorToast(t('structure.blocks.toast.blockReorderError')),
      }
    );
  };

  const handleReorderBlockExercises = (blockId: string, exerciseItemIds: string[]) => {
    reorderExercises.mutate(
      { programId, weekId, blockId, exerciseItemIds },
      {
        onSuccess: () => showSuccessToast(t('structure.exercises.toast.exerciseReordered')),
        onError: () => showErrorToast(t('structure.exercises.toast.exerciseReorderError')),
      }
    );
  };

  const handleMoveBlockToDay = (blockId: string, targetDayId: string) => {
    moveBlock.mutate(
      { programId, weekId, blockId, targetDayId },
      {
        onSuccess: () => showSuccessToast(t('structure.blocks.toast.blockMoved')),
        onError: () => showErrorToast(t('structure.blocks.toast.blockMoveError')),
      }
    );
  };

  /** Copies a block to the end of `targetDayId`; resolves to whether it succeeded. */
  const handleCopyBlock = async (blockId: string, targetDayId: string, successMessage: string) => {
    try {
      await copyBlock.mutateAsync({ programId, weekId, blockId, targetDayId });
      showSuccessToast(successMessage);
      return true;
    } catch (error) {
      showErrorToast(
        parseProgramBlockError(error) === 'notFound'
          ? t('structure.blocks.toast.blockCopyNotFound')
          : t('structure.blocks.toast.blockCopyError')
      );
      return false;
    }
  };

  return {
    handleMerge,
    handleUngroupBlock,
    handleDeleteBlock,
    handleReorderBlocks,
    handleReorderBlockExercises,
    handleMoveBlockToDay,
    handleCopyBlock,
  };
};
