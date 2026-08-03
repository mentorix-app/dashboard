'use client';

import { useTranslations } from '@/i18n';
import {
  ProgramStatus,
  canManageProgram,
  useArchiveProgram,
  useDiscardProgramChanges,
  useProgram,
  useProgramAssignments,
  usePublishProgram,
  usePublishProgramUpdate,
  useSyncProgramAssignments,
} from '@/src/entities/program';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { useToast } from '@/src/shared/hooks';
import { confirm } from '@/src/shared/ui';

/**
 * Owns the published/archived lifecycle actions shown in the wizard header:
 * archive, publish-update (new version), sync assignments to latest,
 * revert (discard unpublished draft changes), and re-publish from archive.
 * The version/assignment queries only run while the program is published so
 * drafts stay cheap. Each action queues its own confirmation via the global
 * `confirm()` singleton.
 */
export const useWizardActions = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();
  const { data: program } = useProgram(programId);
  const { isTrainer } = useCapabilities();
  const currentUser = useCurrentUser();

  const status = program?.status ?? ProgramStatus.Draft;
  const isPublished = status === ProgramStatus.Published;
  const isArchived = status === ProgramStatus.Archived;
  // Admins are read-only for programs; only the owning trainer sees lifecycle
  // actions (archive, publish-update, sync, republish).
  const canManage = !!program && canManageProgram(program, { isTrainer, userId: currentUser?.userId });

  const assignmentsQuery = useProgramAssignments(programId, isPublished);

  const archiveMutation = useArchiveProgram();
  const publishUpdateMutation = usePublishProgramUpdate();
  const republishMutation = usePublishProgram();
  const syncMutation = useSyncProgramAssignments();
  const discardMutation = useDiscardProgramChanges();

  // Single aggregate pending flag: all lifecycle actions live behind the same
  // dropdown trigger, so one flag is enough to disable/spin it while any of
  // them is in flight — the dropdown can't be reopened to fire a second
  // action while its trigger is disabled.
  const isActionPending =
    archiveMutation.isPending ||
    republishMutation.isPending ||
    publishUpdateMutation.isPending ||
    syncMutation.isPending ||
    discardMutation.isPending;

  const behindLatestCount = (assignmentsQuery.data?.items ?? []).filter((item) => item.isBehindLatest).length;
  const canPublishUpdate = canManage && isPublished && program?.hasUnpublishedChanges === true;
  const canSync = canManage && isPublished && behindLatestCount > 0;
  // Reverting only makes sense while there are draft edits to discard, same
  // gate as publish-update.
  const canRevert = canPublishUpdate;

  const requestArchive = () =>
    confirm({
      title: t('actions.archiveModal.title'),
      description: t('actions.archiveModal.description'),
      cancelLabel: t('actions.archiveModal.cancel'),
      confirmLabel: t('actions.archiveModal.confirm'),
      variant: 'destructive',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          archiveMutation.mutate(programId, {
            onSuccess: () => {
              showSuccessToast(t('actions.toast.archiveSuccess'));
              resolve();
            },
            onError: (error) => {
              showErrorToast(t('actions.toast.archiveError'), { description: error.message });
              reject(error);
            },
          });
        }),
    });

  const requestRepublish = () =>
    confirm({
      title: t('actions.republishModal.title'),
      description: t('actions.republishModal.description'),
      cancelLabel: t('actions.republishModal.cancel'),
      confirmLabel: t('actions.republishModal.confirm'),
      variant: 'default',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          republishMutation.mutate(programId, {
            onSuccess: () => {
              showSuccessToast(t('actions.toast.republishSuccess'));
              resolve();
            },
            onError: (error) => {
              showErrorToast(t('actions.toast.republishError'), { description: error.message });
              reject(error);
            },
          });
        }),
    });

  const requestPublishUpdate = () =>
    confirm({
      title: t('actions.publishUpdateModal.title'),
      description: t('actions.publishUpdateModal.description'),
      cancelLabel: t('actions.publishUpdateModal.cancel'),
      confirmLabel: t('actions.publishUpdateModal.confirm'),
      variant: 'default',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          publishUpdateMutation.mutate(programId, {
            onSuccess: () => {
              showSuccessToast(t('actions.toast.publishUpdateSuccess'));
              resolve();
            },
            onError: (error) => {
              showErrorToast(t('actions.toast.publishUpdateError'), { description: error.message });
              reject(error);
            },
          });
        }),
    });

  const requestSync = () =>
    confirm({
      title: t('actions.syncModal.title'),
      description: t('actions.syncModal.description', { count: behindLatestCount }),
      cancelLabel: t('actions.syncModal.cancel'),
      confirmLabel: t('actions.syncModal.confirm'),
      variant: 'default',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          syncMutation.mutate(
            { programId, params: { allActive: true } },
            {
              onSuccess: () => {
                showSuccessToast(t('actions.toast.syncSuccess'));
                resolve();
              },
              onError: (error) => {
                showErrorToast(t('actions.toast.syncError'), { description: error.message });
                reject(error);
              },
            }
          );
        }),
    });

  const requestRevert = () =>
    confirm({
      title: t('actions.revertModal.title'),
      description: t('actions.revertModal.description'),
      cancelLabel: t('actions.revertModal.cancel'),
      confirmLabel: t('actions.revertModal.confirm'),
      variant: 'default',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          discardMutation.mutate(programId, {
            onSuccess: () => {
              showSuccessToast(t('actions.toast.discardSuccess'));
              resolve();
            },
            onError: (error) => {
              showErrorToast(t('actions.toast.discardError'), { description: error.message });
              reject(error);
            },
          });
        }),
    });

  return {
    status,
    // Analytics only carries data once a program has clients (published/archived)
    // and is served to the owning trainer only.
    canViewAnalytics: canManage && status !== ProgramStatus.Draft,
    canArchive: canManage && isPublished,
    canPublishUpdate,
    canSync,
    canRevert,
    canRepublish: canManage && isArchived,
    isActionPending,
    requestArchive,
    requestRepublish,
    requestPublishUpdate,
    requestSync,
    requestRevert,
  };
};
