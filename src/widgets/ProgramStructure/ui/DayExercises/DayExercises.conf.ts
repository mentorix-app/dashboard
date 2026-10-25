'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { ProgramBlockType, type ProgramDayExercise } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';
import { confirm } from '@/src/shared/ui';

import { useDayBlockActions } from '../../hooks/useDayBlockActions';
import { useDayExerciseActions } from '../../hooks/useDayExerciseActions';
import { useBlockCopy } from './hooks/useBlockCopy';
import { getBlockTypeLabelKey, getLastSharedBlockId, haveMatchingBlockVisibility, moveDropsSets } from './lib';
import type { BlockMoveTarget, DayExercisesProps, MoveTargetDay } from './DayExercises.types';

/**
 * Logic for the selected day's block editor: derives move targets and localized
 * names, owns the merge selection, add-picker and copy-dialog state, forwards
 * mutations to the block/exercise action hooks, and queues delete
 * confirmations via the global `confirm()` singleton.
 */
export const useDayExercisesConfig = ({ programId, weekId, day, week, canEdit }: DayExercisesProps) => {
  const t = useTranslations('ProgramWizard');
  const locale = useLocale();
  const { showErrorToast } = useToast();
  const exerciseActions = useDayExerciseActions({ programId, weekId, dayId: day.id });
  const blockActions = useDayBlockActions({ programId, weekId, dayId: day.id });
  const blockCopy = useBlockCopy({
    blocks: day.blocks,
    waitForPendingUpdates: exerciseActions.waitForPendingUpdates,
    copyBlock: blockActions.handleCopyBlock,
  });

  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [visibilityBlockId, setVisibilityBlockId] = useState<string | null>(null);

  const blocks = day.blocks;
  const lastSharedBlockId = getLastSharedBlockId(blocks);
  const selectedIds = blocks.filter((block) => selectedBlockIds.has(block.id)).map((block) => block.id);

  const dayMoveTargets: MoveTargetDay[] = week.days
    .filter((other) => other.id !== day.id)
    .map((other) => ({ id: other.id, label: t('structure.exercises.moveToDayLabel', { number: other.dayNumber }) }));

  const exerciseMoveTargets: BlockMoveTarget[] = blocks
    .filter((block) => block.blockType !== ProgramBlockType.Single)
    .map((block) => ({
      id: block.id,
      label: t('structure.exercises.moveToBlockLabel', { type: t(getBlockTypeLabelKey(block.blockType)) }),
    }));

  const getExerciseLabel = (exercise: ProgramDayExercise) =>
    locale === 'ru' && exercise.exerciseNameRu ? exercise.exerciseNameRu : exercise.exerciseName;

  const handleSelectChange = (blockId: string, checked: boolean) => {
    setSelectedBlockIds((current) => {
      const next = new Set(current);
      if (checked) next.add(blockId);
      else next.delete(blockId);
      return next;
    });
  };

  const handleClearSelection = () => setSelectedBlockIds(new Set());

  const handleMerge = () => {
    const selectedBlocks = blocks.filter((block) => selectedBlockIds.has(block.id));
    if (!haveMatchingBlockVisibility(selectedBlocks)) {
      showErrorToast(t('structure.blocks.visibility.mergeMismatch'));
      return;
    }
    blockActions.handleMerge(selectedIds);
    handleClearSelection();
  };

  const handleConfirmAddSingles = (exerciseIds: string[]) => {
    exerciseActions.handleAddSingles(exerciseIds);
    setPickerOpen(false);
  };

  const handleRequestDeleteExercise = (blockId: string, itemId: string) => {
    confirm({
      title: t('structure.exercises.deleteExerciseConfirmTitle'),
      description: t('structure.exercises.deleteExerciseConfirmDescription'),
      cancelLabel: t('structure.exercises.deleteExerciseCancel'),
      confirmLabel: t('structure.exercises.deleteExerciseConfirm'),
      variant: 'destructive',
      onConfirm: () => exerciseActions.handleDeleteExercise(blockId, itemId),
    });
  };

  // Shared by the row menu and drag-and-drop (including dragging a single into a group).
  const handleMoveExerciseToBlock = (
    blockId: string,
    itemId: string,
    targetBlockId: string,
    targetItemIds?: string[]
  ) => {
    const target = blocks.find((block) => block.id === targetBlockId);
    const clearedSetsBlockLabel =
      target && moveDropsSets(blocks, blockId, itemId, targetBlockId)
        ? t(getBlockTypeLabelKey(target.blockType))
        : undefined;
    void exerciseActions.handleMoveExerciseToBlock(
      blockId,
      itemId,
      targetBlockId,
      targetItemIds,
      clearedSetsBlockLabel
    );
  };

  return {
    t,
    blocks,
    canEdit,
    getExerciseLabel,
    selectedBlockIds,
    dayMoveTargets,
    exerciseMoveTargets,
    selectionCount: selectedIds.length,
    showMergeBar: selectedIds.length >= 2,
    onSelectChange: handleSelectChange,
    onClearSelection: handleClearSelection,
    onMerge: handleMerge,
    isPickerOpen,
    visibilityBlockId,
    lastSharedBlockId,
    onOpenVisibility: setVisibilityBlockId,
    onVisibilityOpenChange: (open: boolean) => {
      if (!open) setVisibilityBlockId(null);
    },
    onOpenPicker: () => setPickerOpen(true),
    onPickerOpenChange: setPickerOpen,
    onConfirmAddSingles: handleConfirmAddSingles,
    onUpdateExercise: exerciseActions.handleUpdateExercise,
    onRequestDeleteExercise: handleRequestDeleteExercise,
    onDuplicateExercise: (blockId: string, itemId: string) => {
      void exerciseActions.handleDuplicateExercise(blockId, itemId);
    },
    onExtractExercise: exerciseActions.handleExtractExercise,
    onMoveExerciseToBlock: handleMoveExerciseToBlock,
    onAddExercise: exerciseActions.handleAddToBlock,
    onUngroupBlock: blockActions.handleUngroupBlock,
    onDeleteBlock: blockActions.handleDeleteBlock,
    onMoveBlockToDay: blockActions.handleMoveBlockToDay,
    onReorderBlocks: blockActions.handleReorderBlocks,
    onReorderBlockExercises: blockActions.handleReorderBlockExercises,
    ...blockCopy,
  };
};
