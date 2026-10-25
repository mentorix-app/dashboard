'use client';

import { useState } from 'react';

import type { CopyBlockDialogProps } from './CopyBlockDialog.types';

/**
 * Shell state of the copy dialog: while a copy is in flight the dialog ignores
 * close requests (Escape, outside click, the X button). The form inside owns
 * the week/day choice and remounts with the dialog content on every open.
 */
export const useCopyBlockDialogConfig = ({ open, block, onOpenChange }: CopyBlockDialogProps) => {
  const [isPending, setPending] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;
    onOpenChange(nextOpen);
  };

  const preventWhilePending = (event: Event) => {
    if (isPending) event.preventDefault();
  };

  return {
    isOpen: open && block !== null,
    handleOpenChange,
    preventWhilePending,
    setPending,
    close: () => onOpenChange(false),
  };
};
