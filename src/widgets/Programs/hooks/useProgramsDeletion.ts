'use client';

import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslations } from '@/i18n';
import { useDeleteProgram, type Program } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

type UseProgramsDeletionParams = {
  programs: Program[];
  selectedIds: ReadonlySet<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

export const useProgramsDeletion = ({ programs, selectedIds, setSelectedIds }: UseProgramsDeletionParams) => {
  const t = useTranslations('Programs');
  const { showSuccessToast, showErrorToast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteProgram = useDeleteProgram();

  const handleDeleteClick = useCallback(() => setIsDeleteDialogOpen(true), []);

  const handleConfirmDelete = useCallback(async () => {
    const ids = programs.filter((program) => selectedIds.has(program.id)).map((program) => program.id);
    if (ids.length === 0) return;

    setIsDeleting(true);

    // No bulk endpoint exists: fan out one soft-delete request per program and
    // keep any that fail still selected so the user can retry.
    const results = await Promise.allSettled(ids.map((id) => deleteProgram.mutateAsync(id)));
    const failedIds = ids.filter((_, index) => results[index]?.status === 'rejected');

    setSelectedIds(new Set(failedIds));
    setIsDeleting(false);
    if (failedIds.length === 0) {
      showSuccessToast(t('toast.deleteSuccess', { count: ids.length }));
      setIsDeleteDialogOpen(false);
    } else {
      showErrorToast(t('toast.deleteError'));
    }
  }, [deleteProgram, programs, selectedIds, setSelectedIds, showSuccessToast, showErrorToast, t]);

  return {
    isDeleteDialogOpen,
    isDeleting,
    handleDeleteClick,
    handleDeleteDialogOpenChange: setIsDeleteDialogOpen,
    handleConfirmDelete,
  };
};
