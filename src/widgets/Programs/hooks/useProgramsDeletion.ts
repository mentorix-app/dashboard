'use client';

import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { useDeleteProgram, type Program } from '@/src/entities/program';

type UseProgramsDeletionParams = {
  programs: Program[];
  selectedIds: ReadonlySet<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

export const useProgramsDeletion = ({ programs, selectedIds, setSelectedIds }: UseProgramsDeletionParams) => {
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
    if (failedIds.length === 0) setIsDeleteDialogOpen(false);
  }, [deleteProgram, programs, selectedIds, setSelectedIds]);

  return {
    isDeleteDialogOpen,
    isDeleting,
    handleDeleteClick,
    handleDeleteDialogOpenChange: setIsDeleteDialogOpen,
    handleConfirmDelete,
  };
};
