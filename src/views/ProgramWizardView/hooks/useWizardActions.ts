'use client';

import { useState } from 'react';
import { useTranslations } from '@/i18n';
import {
  ProgramStatus,
  canManageProgram,
  useArchiveProgram,
  useProgram,
  useProgramAssignments,
  usePublishProgram,
  usePublishProgramUpdate,
  useSyncProgramAssignments,
} from '@/src/entities/program';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { useToast } from '@/src/shared/hooks';

/** The confirmable lifecycle actions; one confirmation modal is open at a time. */
export type WizardActionKey = 'publishUpdate' | 'sync' | 'archive' | 'republish';

type WizardActionModal = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant: 'default' | 'destructive';
  isPending: boolean;
  onConfirm: () => void;
};

/**
 * Owns the published/archived lifecycle actions shown in the wizard header:
 * archive, publish-update (new version), sync assignments to latest, and
 * re-publish from archive. The version/assignment queries only run while the
 * program is published so drafts stay cheap.
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

  const [activeAction, setActiveAction] = useState<WizardActionKey | null>(null);
  const openAction = (action: WizardActionKey) => setActiveAction(action);
  const closeAction = () => setActiveAction(null);

  const behindLatestCount = (assignmentsQuery.data?.items ?? []).filter((item) => item.isBehindLatest).length;
  const canPublishUpdate = canManage && isPublished && program?.hasUnpublishedChanges === true;
  const canSync = canManage && isPublished && behindLatestCount > 0;

  const handleConfirmArchive = () =>
    archiveMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('actions.toast.archiveSuccess'));
        closeAction();
      },
      onError: (error) => {
        showErrorToast(t('actions.toast.archiveError'), { description: error.message });
        closeAction();
      },
    });

  const handleConfirmRepublish = () =>
    republishMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('actions.toast.republishSuccess'));
        closeAction();
      },
      onError: (error) => {
        showErrorToast(t('actions.toast.republishError'), { description: error.message });
        closeAction();
      },
    });

  const handleConfirmPublishUpdate = () =>
    publishUpdateMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('actions.toast.publishUpdateSuccess'));
        closeAction();
      },
      onError: (error) => {
        showErrorToast(t('actions.toast.publishUpdateError'), { description: error.message });
        closeAction();
      },
    });

  const handleConfirmSync = () =>
    syncMutation.mutate(
      { programId, params: { allActive: true } },
      {
        onSuccess: () => {
          showSuccessToast(t('actions.toast.syncSuccess'));
          closeAction();
        },
        onError: (error) => {
          showErrorToast(t('actions.toast.syncError'), { description: error.message });
          closeAction();
        },
      }
    );

  const modalByAction: Record<WizardActionKey, WizardActionModal> = {
    publishUpdate: {
      title: t('actions.publishUpdateModal.title'),
      description: t('actions.publishUpdateModal.description'),
      cancelLabel: t('actions.publishUpdateModal.cancel'),
      confirmLabel: t('actions.publishUpdateModal.confirm'),
      confirmVariant: 'default',
      isPending: publishUpdateMutation.isPending,
      onConfirm: handleConfirmPublishUpdate,
    },
    sync: {
      title: t('actions.syncModal.title'),
      description: t('actions.syncModal.description', { count: behindLatestCount }),
      cancelLabel: t('actions.syncModal.cancel'),
      confirmLabel: t('actions.syncModal.confirm'),
      confirmVariant: 'default',
      isPending: syncMutation.isPending,
      onConfirm: handleConfirmSync,
    },
    archive: {
      title: t('actions.archiveModal.title'),
      description: t('actions.archiveModal.description'),
      cancelLabel: t('actions.archiveModal.cancel'),
      confirmLabel: t('actions.archiveModal.confirm'),
      confirmVariant: 'destructive',
      isPending: archiveMutation.isPending,
      onConfirm: handleConfirmArchive,
    },
    republish: {
      title: t('actions.republishModal.title'),
      description: t('actions.republishModal.description'),
      cancelLabel: t('actions.republishModal.cancel'),
      confirmLabel: t('actions.republishModal.confirm'),
      confirmVariant: 'default',
      isPending: republishMutation.isPending,
      onConfirm: handleConfirmRepublish,
    },
  };

  const activeModal = activeAction ? modalByAction[activeAction] : null;

  return {
    status,
    // Analytics only carries data once a program has clients (published/archived)
    // and is served to the owning trainer only.
    canViewAnalytics: canManage && status !== ProgramStatus.Draft,
    canArchive: canManage && isPublished,
    canPublishUpdate,
    canSync,
    canRepublish: canManage && isArchived,
    isArchiving: archiveMutation.isPending,
    isRepublishing: republishMutation.isPending,
    isPublishingUpdate: publishUpdateMutation.isPending,
    isSyncing: syncMutation.isPending,
    openAction,
    closeAction,
    activeModal,
  };
};
