'use client';

import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { useDeleteExercises, type Exercise } from '@/src/entities/exercise';

type UseExercisesDeletionParams = {
  exercises: Exercise[];
  selectedIds: ReadonlySet<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

export const useExercisesDeletion = ({ exercises, selectedIds, setSelectedIds }: UseExercisesDeletionParams) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteExercises = useDeleteExercises();

  const handleDeleteClick = useCallback(() => setIsDeleteDialogOpen(true), []);

  const handleConfirmDelete = useCallback(() => {
    const ids = exercises.filter((exercise) => selectedIds.has(exercise.id)).map((exercise) => exercise.id);
    if (ids.length === 0) return;

    deleteExercises.mutate(
      { ids },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
          setIsDeleteDialogOpen(false);
        },
      }
    );
  }, [deleteExercises, exercises, selectedIds, setSelectedIds]);

  return {
    isDeleteDialogOpen,
    isDeleting: deleteExercises.isPending,
    handleDeleteClick,
    handleDeleteDialogOpenChange: setIsDeleteDialogOpen,
    handleConfirmDelete,
  };
};
