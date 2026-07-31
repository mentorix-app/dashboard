'use client';

import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { useTranslations } from '@/i18n';
import { useDeleteProgram, type Program } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';
import { confirm } from '@/src/shared/ui';

type UseProgramsDeletionParams = {
  programs: Program[];
  selectedIds: ReadonlySet<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

export const useProgramsDeletion = ({ programs, selectedIds, setSelectedIds }: UseProgramsDeletionParams) => {
  const t = useTranslations('Programs');
  const { showSuccessToast, showErrorToast } = useToast();
  const deleteProgram = useDeleteProgram();

  // Retry re-queues by calling back into `runDelete`; a ref sidesteps a
  // self-referential `useCallback` (the callback can't depend on its own
  // not-yet-assigned identity) while still always invoking the latest version.
  const runDeleteRef = useRef<(ids: string[]) => Promise<void>>(null);

  // No bulk endpoint exists: fan out one soft-delete request per program and
  // re-queue a confirmation for any that fail so the user can retry.
  const runDelete = useCallback(
    async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => deleteProgram.mutateAsync(id)));
      const failedIds = ids.filter((_, index) => results[index]?.status === 'rejected');
      const succeededIds = ids.filter((_, index) => results[index]?.status === 'fulfilled');

      setSelectedIds((prev) => {
        const next = new Set(prev);
        succeededIds.forEach((id) => next.delete(id));
        return next;
      });

      if (failedIds.length === 0) {
        showSuccessToast(t('toast.deleteSuccess', { count: succeededIds.length }));
        return;
      }

      showErrorToast(t('toast.deleteError'));
      const failedPrograms = programs.filter((program) => failedIds.includes(program.id));
      const names = failedPrograms.map((program) => program.name).join(', ');
      confirm({
        title: t('deleteConfirm.title', { count: failedIds.length }),
        description: t('deleteConfirm.description', {
          count: failedIds.length,
          names: names || t('deleteConfirm.selectedItems'),
        }),
        cancelLabel: t('deleteConfirm.cancel'),
        confirmLabel: t('deleteConfirm.confirm'),
        variant: 'destructive',
        onConfirm: () => runDeleteRef.current!(failedIds),
      });
    },
    [deleteProgram, programs, setSelectedIds, showSuccessToast, showErrorToast, t]
  );
  // Assigning during render is disallowed; sync the ref after commit instead.
  useEffect(() => {
    runDeleteRef.current = runDelete;
  }, [runDelete]);

  // Bulk delete acts on the current selection; the per-row menu targets one id.
  const handleDeleteClick = useCallback(() => {
    const ids = programs.filter((program) => selectedIds.has(program.id)).map((program) => program.id);
    if (ids.length === 0) return;
    const targetPrograms = programs.filter((program) => ids.includes(program.id));
    const names = targetPrograms.map((program) => program.name).join(', ');

    confirm({
      title: t('deleteConfirm.title', { count: ids.length }),
      description: t('deleteConfirm.description', {
        count: ids.length,
        names: names || t('deleteConfirm.selectedItems'),
      }),
      cancelLabel: t('deleteConfirm.cancel'),
      confirmLabel: t('deleteConfirm.confirm'),
      variant: 'destructive',
      onConfirm: () => runDelete(ids),
    });
  }, [programs, selectedIds, runDelete, t]);

  const handleDeleteProgram = useCallback(
    (id: string) => {
      const program = programs.find((p) => p.id === id);

      confirm({
        title: t('deleteConfirm.title', { count: 1 }),
        description: t('deleteConfirm.description', {
          count: 1,
          names: program?.name ?? t('deleteConfirm.selectedItems'),
        }),
        cancelLabel: t('deleteConfirm.cancel'),
        confirmLabel: t('deleteConfirm.confirm'),
        variant: 'destructive',
        onConfirm: () => runDelete([id]),
      });
    },
    [programs, runDelete, t]
  );

  return {
    handleDeleteClick,
    handleDeleteProgram,
  };
};
