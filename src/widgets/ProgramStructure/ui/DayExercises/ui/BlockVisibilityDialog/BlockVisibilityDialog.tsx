'use client';

import type React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Typography,
} from '@/src/shared/ui';

import { BlockVisibilityFields } from '../BlockVisibilityFields';
import { getBlockVisibilityErrorMessageKey } from '../BlockVisibilityFields/BlockVisibilityFields.utils';
import { BlockSaveButton } from '../BlockSaveButton';
import { useBlockVisibilityDialogConfig } from './BlockVisibilityDialog.conf';
import type { BlockVisibilityDialogProps } from './BlockVisibilityDialog.types';

export const BlockVisibilityDialog: React.FC<BlockVisibilityDialogProps> = (props) => {
  const config = useBlockVisibilityDialogConfig(props);

  return (
    <Dialog open={props.open} onOpenChange={config.handleOpenChange}>
      <DialogContent
        className="flex h-[min(36rem,calc(100vh-2rem))] max-h-[90vh] flex-col gap-5 overflow-hidden sm:max-w-2xl"
        onEscapeKeyDown={(event) => {
          if (config.isPending) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (config.isPending) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{config.t('structure.blocks.editDialog.title')}</DialogTitle>
          <DialogDescription>{config.t('structure.blocks.visibility.dialogDescription')}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <section>
            <BlockVisibilityFields config={config.visibility} />
          </section>
        </div>

        {config.errorKey ? (
          <Typography variant="p-sm" className="text-destructive" role="alert">
            {config.t(getBlockVisibilityErrorMessageKey(config.errorKey))}
          </Typography>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => config.handleOpenChange(false)}
            disabled={config.isPending}
          >
            {config.t('structure.blocks.editDialog.cancel')}
          </Button>
          <BlockSaveButton
            label={config.t('structure.blocks.editDialog.save')}
            isPending={config.isPending}
            hint={
              config.visibility.hasEmptyRestriction && !config.isPending
                ? config.t('structure.blocks.visibility.saveHint')
                : undefined
            }
            onClick={config.handleSave}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
