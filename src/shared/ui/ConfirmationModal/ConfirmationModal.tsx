'use client';

import { type FC } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '../Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../Dialog';
import type { ConfirmationModalProps } from './ConfirmationModal.types';

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  isPending = false,
  onOpenChange,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending} aria-busy={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
