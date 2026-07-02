'use client';

import { useState } from 'react';
import { useTranslations } from '@/i18n';
import {
  ProgramStatus,
  useArchiveProgram,
  useProgram,
  useProgramAssignments,
  usePublishProgram,
  usePublishProgramUpdate,
  useSyncProgramAssignments,
} from '@/src/entities/program';
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

  const status = program?.status ?? ProgramStatus.Draft;
  const isPublished = status === ProgramStatus.Published;
  const isArchived = status === ProgramStatus.Archived;

  const assignmentsQuery = useProgramAssignments(programId, isPublished);

  const archiveMutation = useArchiveProgram();
  const publishUpdateMutation = usePublishProgramUpdate();
  const republishMutation = usePublishProgram();
  const syncMutation = useSyncProgramAssignments();

  const [activeAction, setActiveAction] = useState<WizardActionKey | null>(null);
  const openAction = (action: WizardActionKey) => setActiveAction(action);
  const closeAction = () => setActiveAction(null);

  const behindLatestCount = (assignmentsQuery.data?.items ?? []).filter((item) => item.isBehindLatest).length;
  const canPublishUpdate = isPublished && program?.hasUnpublishedChanges === true;
  const canSync = isPublished && behindLatestCount > 0;

  const handleConfirmArchive = () =>
    archiveMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('actions.toast.archiveSuccess'));
        closeAction();
      },
      onError: () => showErrorToast(t('actions.toast.archiveError')),
    });

  const handleConfirmRepublish = () =>
    republishMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('actions.toast.republishSuccess'));
        closeAction();
      },
      onError: () => showErrorToast(t('actions.toast.republishError')),
    });

  const handleConfirmPublishUpdate = () =>
    publishUpdateMutation.mutate(programId, {
      onSuccess: () => {
        showSuccessToast(t('actions.toast.publishUpdateSuccess'));
        closeAction();
      },
      onError: () => showErrorToast(t('actions.toast.publishUpdateError')),
    });

  const handleConfirmSync = () =>
    syncMutation.mutate(
      { programId, params: { allActive: true } },
      {
        onSuccess: () => {
          showSuccessToast(t('actions.toast.syncSuccess'));
          closeAction();
        },
        onError: () => showErrorToast(t('actions.toast.syncError')),
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
    canArchive: isPublished,
    canPublishUpdate,
    canSync,
    canRepublish: isArchived,
    isArchiving: archiveMutation.isPending,
    isRepublishing: republishMutation.isPending,
    isPublishingUpdate: publishUpdateMutation.isPending,
    isSyncing: syncMutation.isPending,
    openAction,
    closeAction,
    activeModal,
  };
};
