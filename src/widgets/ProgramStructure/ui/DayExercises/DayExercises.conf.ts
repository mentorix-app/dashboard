'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { ProgramBlockType, type ProgramDayExercise } from '@/src/entities/program';

import { useDayBlockActions } from '../../hooks/useDayBlockActions';
import { useDayExerciseActions } from '../../hooks/useDayExerciseActions';
import { BLOCK_TYPE_LABEL_KEY } from './DayExercises.constants';
import type { BlockMoveTarget, DayExercisesProps, MoveTargetDay } from './DayExercises.types';

type PendingExerciseDeletion = { blockId: string; itemId: string };

/**
 * Logic for the selected day's block editor: derives move targets and localized
 * names, owns the merge selection, add-picker and delete-confirmation state, and
 * forwards mutations to the block/exercise action hooks.
 */
export const useDayExercisesConfig = ({ programId, weekId, day, week, canEdit }: DayExercisesProps) => {
  const t = useTranslations('ProgramWizard');
  const locale = useLocale();
  const exerciseActions = useDayExerciseActions({ programId, weekId, dayId: day.id });
  const blockActions = useDayBlockActions({ programId, weekId, dayId: day.id });

  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<PendingExerciseDeletion | null>(null);

  const blocks = day.blocks;
  const selectedIds = blocks.filter((block) => selectedBlockIds.has(block.id)).map((block) => block.id);

  const dayMoveTargets: MoveTargetDay[] = week.days
    .filter((other) => other.id !== day.id)
    .map((other) => ({ id: other.id, label: t('structure.exercises.moveToDayLabel', { number: other.dayNumber }) }));

  const exerciseMoveTargets: BlockMoveTarget[] = blocks
    .filter((block) => block.blockType !== ProgramBlockType.Single)
    .map((block) => ({
      id: block.id,
      label: t('structure.exercises.moveToBlockLabel', { type: t(BLOCK_TYPE_LABEL_KEY[block.blockType]) }),
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
    blockActions.handleMerge(selectedIds);
    handleClearSelection();
  };

  const handleConfirmAddSingles = (exerciseIds: string[]) => {
    exerciseActions.handleAddSingles(exerciseIds);
    setPickerOpen(false);
  };

  const handleRequestDeleteExercise = (blockId: string, itemId: string) => setPendingDeletion({ blockId, itemId });

  const handleConfirmDelete = () => {
    if (!pendingDeletion) return;
    exerciseActions.handleDeleteExercise(pendingDeletion.blockId, pendingDeletion.itemId);
    setPendingDeletion(null);
  };

  const handleDeleteModalOpenChange = (open: boolean) => {
    if (!open) setPendingDeletion(null);
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
    onOpenPicker: () => setPickerOpen(true),
    onPickerOpenChange: setPickerOpen,
    onConfirmAddSingles: handleConfirmAddSingles,
    onUpdateExercise: exerciseActions.handleUpdateExercise,
    onRequestDeleteExercise: handleRequestDeleteExercise,
    onExtractExercise: exerciseActions.handleExtractExercise,
    onMoveExerciseToBlock: exerciseActions.handleMoveExerciseToBlock,
    onAddExercise: exerciseActions.handleAddToBlock,
    onPatchBlock: blockActions.handlePatchBlock,
    onUngroupBlock: blockActions.handleUngroupBlock,
    onDeleteBlock: blockActions.handleDeleteBlock,
    onMoveBlockToDay: blockActions.handleMoveBlockToDay,
    onReorderBlocks: blockActions.handleReorderBlocks,
    onReorderBlockExercises: blockActions.handleReorderBlockExercises,
    isDeleteModalOpen: pendingDeletion !== null,
    onDeleteModalOpenChange: handleDeleteModalOpenChange,
    onConfirmDelete: handleConfirmDelete,
  };
};
