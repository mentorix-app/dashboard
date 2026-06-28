'use client';

import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslations } from '@/i18n';
import { useDeleteExercises, type Exercise } from '@/src/entities/exercise';
import { useToast } from '@/src/shared/hooks';

type UseExercisesDeletionParams = {
  exercises: Exercise[];
  selectedIds: ReadonlySet<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

export const useExercisesDeletion = ({ exercises, selectedIds, setSelectedIds }: UseExercisesDeletionParams) => {
  const t = useTranslations('Exercises');
  const { showSuccessToast, showErrorToast } = useToast();
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
          showSuccessToast(t('toast.deleteSuccess', { count: ids.length }));
          setSelectedIds(new Set());
          setIsDeleteDialogOpen(false);
        },
        onError: () => showErrorToast(t('toast.deleteError')),
      }
    );
  }, [deleteExercises, exercises, selectedIds, setSelectedIds, showSuccessToast, showErrorToast, t]);

  return {
    isDeleteDialogOpen,
    isDeleting: deleteExercises.isPending,
    handleDeleteClick,
    handleDeleteDialogOpenChange: setIsDeleteDialogOpen,
    handleConfirmDelete,
  };
};
