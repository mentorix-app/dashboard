'use client';

import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { useTranslations } from '@/i18n';
import { useDeleteExercises, type Exercise } from '@/src/entities/exercise';
import { useToast } from '@/src/shared/hooks';
import { confirm } from '@/src/shared/ui';

type UseExercisesDeletionParams = {
  exercises: Exercise[];
  selectedIds: ReadonlySet<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

export const useExercisesDeletion = ({ exercises, selectedIds, setSelectedIds }: UseExercisesDeletionParams) => {
  const t = useTranslations('Exercises');
  const { showSuccessToast, showErrorToast } = useToast();
  const deleteExercises = useDeleteExercises();

  const handleDeleteClick = useCallback(() => {
    const ids = exercises.filter((exercise) => selectedIds.has(exercise.id)).map((exercise) => exercise.id);
    if (ids.length === 0) return;
    const names = exercises
      .filter((exercise) => ids.includes(exercise.id))
      .map((exercise) => exercise.name)
      .join(', ');

    confirm({
      title: t('deleteConfirm.title', { count: ids.length }),
      description: t('deleteConfirm.description', {
        count: ids.length,
        names: names || t('deleteConfirm.selectedItems'),
      }),
      cancelLabel: t('deleteConfirm.cancel'),
      confirmLabel: t('deleteConfirm.confirm'),
      variant: 'destructive',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          deleteExercises.mutate(
            { ids },
            {
              onSuccess: () => {
                showSuccessToast(t('toast.deleteSuccess', { count: ids.length }));
                setSelectedIds(new Set());
                resolve();
              },
              onError: () => {
                showErrorToast(t('toast.deleteError'));
                reject(new Error('deleteExercises failed'));
              },
            }
          );
        }),
    });
  }, [deleteExercises, exercises, selectedIds, setSelectedIds, showSuccessToast, showErrorToast, t]);

  return {
    handleDeleteClick,
  };
};
