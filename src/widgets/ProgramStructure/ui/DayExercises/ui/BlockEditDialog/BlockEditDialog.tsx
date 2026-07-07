'use client';

import { useTranslations } from '@/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/shared/ui';

import type { BlockEditDialogProps, BlockEditValue } from './BlockEditDialog.types';
import { BlockEditForm } from '../BlockEditForm';

/** Dialog to change a group block's type and instruction. */
export const BlockEditDialog = ({ block, open, onOpenChange, onSubmit }: BlockEditDialogProps) => {
  const t = useTranslations('ProgramWizard');

  const handleSubmit = (value: BlockEditValue) => {
    onSubmit(block.id, value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('structure.blocks.editDialog.title')}</DialogTitle>
        </DialogHeader>

        <BlockEditForm block={block} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
