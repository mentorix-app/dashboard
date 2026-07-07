'use client';

import { Archive, Check, Loader2, RefreshCw, UploadCloud } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button, ConfirmationModal } from '@/src/shared/ui';

import { useWizardActions } from '../../hooks/useWizardActions';

type WizardHeaderActionsProps = {
  programId: string;
  /**
   * Client-side publish gate shared with the draft publish flow. Returns false
   * (and surfaces the inline validation banners) when the program is not
   * publishable, so publish-update never opens its confirm modal in that case.
   */
  validateBeforePublish: () => boolean;
};

export const WizardHeaderActions = ({ programId, validateBeforePublish }: WizardHeaderActionsProps) => {
  const t = useTranslations('ProgramWizard');
  const {
    canArchive,
    canPublishUpdate,
    canSync,
    canRepublish,
    isArchiving,
    isRepublishing,
    isPublishingUpdate,
    isSyncing,
    openAction,
    closeAction,
    activeModal,
  } = useWizardActions(programId);

  const handlePublishUpdateClick = () => {
    if (validateBeforePublish()) openAction('publishUpdate');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canSync ? (
        <Button type="button" variant="secondary" size="sm" onClick={() => openAction('sync')} disabled={isSyncing}>
          {isSyncing ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
          {t('actions.sync')}
        </Button>
      ) : null}

      {canPublishUpdate ? (
        <Button type="button" size="sm" onClick={handlePublishUpdateClick} disabled={isPublishingUpdate}>
          {isPublishingUpdate ? <Loader2 className="animate-spin" aria-hidden /> : <UploadCloud aria-hidden />}
          {t('actions.publishUpdate')}
        </Button>
      ) : null}

      {canArchive ? (
        <Button type="button" variant="outline" size="sm" onClick={() => openAction('archive')} disabled={isArchiving}>
          {isArchiving ? <Loader2 className="animate-spin" aria-hidden /> : <Archive aria-hidden />}
          {t('actions.archive')}
        </Button>
      ) : null}

      {canRepublish ? (
        <Button type="button" size="sm" onClick={() => openAction('republish')} disabled={isRepublishing}>
          {isRepublishing ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
          {t('actions.republish')}
        </Button>
      ) : null}

      {activeModal ? (
        <ConfirmationModal
          open
          title={activeModal.title}
          description={activeModal.description}
          cancelLabel={activeModal.cancelLabel}
          confirmLabel={activeModal.confirmLabel}
          confirmVariant={activeModal.confirmVariant}
          isPending={activeModal.isPending}
          onOpenChange={(open) => {
            if (!open) closeAction();
          }}
          onConfirm={activeModal.onConfirm}
        />
      ) : null}
    </div>
  );
};
