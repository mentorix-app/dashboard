'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import type { ProgramDayBlock } from '@/src/entities/program';
import { confirm } from '@/src/shared/ui';

type UseGroupBlockCardConfigParams = {
  block: ProgramDayBlock;
  onAddExercise: (blockId: string, exerciseIds: string[]) => void;
  onDeleteBlock: (blockId: string) => void;
};

/** Owns the group card's dialog/picker state and queues its delete confirmation via `confirm()`. */
export const useGroupBlockCardConfig = ({ block, onAddExercise, onDeleteBlock }: UseGroupBlockCardConfigParams) => {
  const t = useTranslations('ProgramWizard');
  const [isEditOpen, setEditOpen] = useState(false);
  const [isPickerOpen, setPickerOpen] = useState(false);

  const excludeIds = block.exercises.map((exercise) => exercise.exerciseId);

  const handleAddConfirm = (exerciseIds: string[]) => {
    onAddExercise(block.id, exerciseIds);
    setPickerOpen(false);
  };

  const handleRequestDelete = () => {
    confirm({
      title: t('structure.blocks.deleteBlockConfirmTitle'),
      description: t('structure.blocks.deleteBlockConfirmDescription'),
      cancelLabel: t('structure.blocks.deleteBlockCancel'),
      confirmLabel: t('structure.blocks.deleteBlockConfirm'),
      variant: 'destructive',
      onConfirm: () => onDeleteBlock(block.id),
    });
  };

  return {
    isEditOpen,
    isPickerOpen,
    excludeIds,
    onEditOpenChange: setEditOpen,
    onPickerOpenChange: setPickerOpen,
    onOpenEdit: () => setEditOpen(true),
    onOpenPicker: () => setPickerOpen(true),
    onOpenDelete: handleRequestDelete,
    handleAddConfirm,
  };
};
