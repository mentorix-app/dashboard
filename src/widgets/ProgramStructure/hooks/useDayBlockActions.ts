'use client';

import { useTranslations } from '@/i18n';
import {
  useDeleteProgramDayBlock,
  useMergeProgramDayBlocks,
  useMoveProgramDayBlock,
  usePatchProgramDayBlock,
  useReorderProgramBlockExercises,
  useReorderProgramDayBlocks,
  useUngroupProgramDayBlock,
} from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import type { BlockEditValue } from '../ui/DayExercises/ui/BlockEditDialog';

type UseDayBlockActionsParams = {
  programId: string;
  weekId: string;
  dayId: string;
};

/**
 * Block-level mutations for the selected day: grouping singles, editing and
 * ungrouping/deleting groups, reordering (blocks and grouped exercises) and
 * moving a whole block to another day. Every response rewrites the program.
 */
export const useDayBlockActions = ({ programId, weekId, dayId }: UseDayBlockActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const merge = useMergeProgramDayBlocks();
  const patch = usePatchProgramDayBlock();
  const ungroup = useUngroupProgramDayBlock();
  const remove = useDeleteProgramDayBlock();
  const reorderBlocks = useReorderProgramDayBlocks();
  const reorderExercises = useReorderProgramBlockExercises();
  const moveBlock = useMoveProgramDayBlock();

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

  const handlePatchBlock = (blockId: string, value: BlockEditValue) => {
    patch.mutate(
      { programId, weekId, blockId, blockType: value.blockType, instruction: value.instruction },
      {
        onSuccess: () => showSuccessToast(t('structure.blocks.toast.blockUpdated')),
        onError: () => showErrorToast(t('structure.blocks.toast.blockUpdateError')),
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

  return {
    handleMerge,
    handlePatchBlock,
    handleUngroupBlock,
    handleDeleteBlock,
    handleReorderBlocks,
    handleReorderBlockExercises,
    handleMoveBlockToDay,
  };
};
