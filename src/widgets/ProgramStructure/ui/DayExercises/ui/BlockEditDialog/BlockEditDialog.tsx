'use client';

import { useTranslations } from '@/i18n';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui';

import type { BlockEditDialogProps } from './BlockEditDialog.types';
import { BlockEditForm } from '../BlockEditForm';
import { useBlockEditDialogConfig } from './BlockEditDialog.conf';

/** Dialog to change a group block's type and instruction. */
export const BlockEditDialog = (props: BlockEditDialogProps) => {
  const t = useTranslations('ProgramWizard');
  const config = useBlockEditDialogConfig(props);

  return (
    <Dialog open={props.open} onOpenChange={config.handleOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto sm:max-w-2xl"
        onEscapeKeyDown={(event) => {
          if (config.isPending) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (config.isPending) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('structure.blocks.editDialog.title')}</DialogTitle>
          <DialogDescription>{t('structure.blocks.editDialog.description')}</DialogDescription>
        </DialogHeader>

        <BlockEditForm
          block={props.block}
          visibility={config.visibility}
          isPending={config.isPending}
          errorKey={config.errorKey}
          metadataSaved={config.metadataSaved}
          onSubmit={config.handleSave}
          onCancel={() => config.handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
