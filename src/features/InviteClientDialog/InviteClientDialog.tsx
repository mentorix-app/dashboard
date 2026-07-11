'use client';

import { Copy, Loader2 } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from '@/src/shared/ui';

import { useInviteClientDialogConfig } from './InviteClientDialog.conf';
import type { InviteClientDialogProps } from './InviteClientDialog.types';

export const InviteClientDialog = (props: InviteClientDialogProps) => {
  const { t, open, onOpenChange, invite, isPending, errorMessage, expiresLabel, onGenerate, onCopy } =
    useInviteClientDialogConfig(props);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {invite ? (
          <div className="flex flex-col gap-2">
            <Typography variant="p-sm" className="font-medium">
              {t('linkLabel')}
            </Typography>
            <div className="flex items-center gap-2">
              <Input value={invite.inviteUrl} readOnly aria-label={t('linkLabel')} className="flex-1" />
              <Button type="button" variant="outline" size="icon" aria-label={t('copy')} onClick={onCopy}>
                <Copy className="size-4" />
              </Button>
            </div>
            {expiresLabel ? (
              <Typography variant="p-xs" className="text-muted-foreground">
                {expiresLabel}
              </Typography>
            ) : null}
            <Typography variant="p-sm" className="text-muted-foreground">
              {t('instructions')}
            </Typography>
          </div>
        ) : null}

        {errorMessage ? (
          <Typography variant="p-sm" className="text-destructive">
            {errorMessage}
          </Typography>
        ) : null}

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
          <Button type="button" onClick={onGenerate} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isPending ? t('generating') : invite ? t('regenerate') : t('generate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
