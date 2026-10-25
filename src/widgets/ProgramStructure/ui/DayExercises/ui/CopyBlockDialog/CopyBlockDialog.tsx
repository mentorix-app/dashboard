'use client';

import { useTranslations } from '@/i18n';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui';

import { useCopyBlockDialogConfig } from './CopyBlockDialog.conf';
import type { CopyBlockDialogProps } from './CopyBlockDialog.types';
import { CopyBlockForm } from './ui/CopyBlockForm';

/** Copies a block (single or group) to the end of any day of any week of the program. */
export const CopyBlockDialog = (props: CopyBlockDialogProps) => {
  const t = useTranslations('ProgramWizard');
  const config = useCopyBlockDialogConfig(props);
  const { block, programId, sourceWeekId, sourceDayId, getExerciseLabel, onCopy } = props;

  return (
    <Dialog open={config.isOpen} onOpenChange={config.handleOpenChange}>
      <DialogContent
        className="flex h-dvh w-screen max-w-none flex-col gap-5 rounded-none border-0 p-4 sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:max-w-xl sm:rounded-md sm:border sm:p-6"
        onEscapeKeyDown={config.preventWhilePending}
        onPointerDownOutside={config.preventWhilePending}
      >
        <DialogHeader>
          <DialogTitle>{t('structure.blocks.copyDialog.title')}</DialogTitle>
          <DialogDescription>{t('structure.blocks.copyDialog.description')}</DialogDescription>
        </DialogHeader>

        {block ? (
          <CopyBlockForm
            key={block.id}
            programId={programId}
            sourceWeekId={sourceWeekId}
            sourceDayId={sourceDayId}
            block={block}
            getExerciseLabel={getExerciseLabel}
            onCopy={onCopy}
            onPendingChange={config.setPending}
            onClose={config.close}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
