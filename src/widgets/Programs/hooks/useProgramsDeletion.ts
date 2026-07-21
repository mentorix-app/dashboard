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
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteProgram = useDeleteProgram();

  // Bulk delete acts on the current selection; the per-row menu targets one id.
  const handleDeleteClick = useCallback(() => {
    const ids = programs.filter((program) => selectedIds.has(program.id)).map((program) => program.id);
    if (ids.length === 0) return;
    setPendingIds(ids);
    setIsDeleteDialogOpen(true);
  }, [programs, selectedIds]);

  const handleDeleteProgram = useCallback((id: string) => {
    setPendingIds([id]);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (pendingIds.length === 0) return;

    setIsDeleting(true);

    // No bulk endpoint exists: fan out one soft-delete request per program and
    // keep any that fail pending so the user can retry.
    const results = await Promise.allSettled(pendingIds.map((id) => deleteProgram.mutateAsync(id)));
    const failedIds = pendingIds.filter((_, index) => results[index]?.status === 'rejected');
    const succeededIds = pendingIds.filter((_, index) => results[index]?.status === 'fulfilled');

    setSelectedIds((prev) => {
      const next = new Set(prev);
      succeededIds.forEach((id) => next.delete(id));
      return next;
    });
    setIsDeleting(false);

    if (failedIds.length === 0) {
      showSuccessToast(t('toast.deleteSuccess', { count: succeededIds.length }));
      setIsDeleteDialogOpen(false);
      setPendingIds([]);
    } else {
      showErrorToast(t('toast.deleteError'));
      setPendingIds(failedIds);
    }
  }, [pendingIds, deleteProgram, setSelectedIds, showSuccessToast, showErrorToast, t]);

  const pendingPrograms = programs.filter((program) => pendingIds.includes(program.id));

  return {
    isDeleteDialogOpen,
    isDeleting,
    pendingCount: pendingIds.length,
    pendingPrograms,
    handleDeleteClick,
    handleDeleteProgram,
    handleDeleteDialogOpenChange: setIsDeleteDialogOpen,
    handleConfirmDelete,
  };
};
