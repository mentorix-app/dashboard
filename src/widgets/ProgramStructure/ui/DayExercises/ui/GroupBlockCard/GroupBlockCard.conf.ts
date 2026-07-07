'use client';

import { useState } from 'react';

import type { ProgramDayBlock } from '@/src/entities/program';

type UseGroupBlockCardConfigParams = {
  block: ProgramDayBlock;
  onAddExercise: (blockId: string, exerciseIds: string[]) => void;
  onDeleteBlock: (blockId: string) => void;
};

/** Owns the group card's dialog/picker/confirmation state and their handlers. */
export const useGroupBlockCardConfig = ({ block, onAddExercise, onDeleteBlock }: UseGroupBlockCardConfigParams) => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const excludeIds = block.exercises.map((exercise) => exercise.exerciseId);

  const handleAddConfirm = (exerciseIds: string[]) => {
    onAddExercise(block.id, exerciseIds);
    setPickerOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDeleteBlock(block.id);
    setDeleteOpen(false);
  };

  return {
    isEditOpen,
    isPickerOpen,
    isDeleteOpen,
    excludeIds,
    onEditOpenChange: setEditOpen,
    onPickerOpenChange: setPickerOpen,
    onDeleteOpenChange: setDeleteOpen,
    onOpenEdit: () => setEditOpen(true),
    onOpenPicker: () => setPickerOpen(true),
    onOpenDelete: () => setDeleteOpen(true),
    handleAddConfirm,
    handleDeleteConfirm,
  };
};
