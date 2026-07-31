'use client';

import { ConfirmationModal } from './ConfirmationModal';
import { useConfirmStore } from './confirmStore';

/** Mount once (in `Providers`). Renders whatever confirmation request is queued via `confirm()`. */
export const ConfirmationModalHost = () => {
  const request = useConfirmStore((state) => state.request);
  const isPending = useConfirmStore((state) => state.isPending);
  const handleConfirm = useConfirmStore((state) => state.handleConfirm);
  const handleCancel = useConfirmStore((state) => state.handleCancel);

  if (!request) return null;

  return (
    <ConfirmationModal
      open
      title={request.title}
      description={request.description}
      cancelLabel={request.cancelLabel}
      confirmLabel={request.confirmLabel}
      confirmVariant={request.variant}
      isPending={isPending}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
      onConfirm={handleConfirm}
    />
  );
};
