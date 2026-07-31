import { create } from 'zustand';

import type { ConfirmationModalProps } from './ConfirmationModal.types';

export type ConfirmOptions = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  variant?: ConfirmationModalProps['confirmVariant'];
  onConfirm: () => void | Promise<void>;
};

type ConfirmStoreState = {
  request: ConfirmOptions | null;
  isPending: boolean;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
};

/**
 * Singleton confirmation-dialog store, mirroring the `sonner` toast pattern:
 * a single `<ConfirmationModalHost />` (mounted once in `Providers`) renders
 * whatever request is queued here, so call sites just invoke `confirm()`
 * instead of owning their own open-state + `<ConfirmationModal />` JSX.
 */
export const useConfirmStore = create<ConfirmStoreState>((set, get) => ({
  request: null,
  isPending: false,
  handleConfirm: async () => {
    const activeRequest = get().request;
    if (!activeRequest) return;

    set({ isPending: true });
    try {
      await activeRequest.onConfirm();
    } finally {
      // `onConfirm` may itself queue a follow-up `confirm()` call (e.g. to
      // retry with only the items that failed) — only clear the request if
      // it's still the one we started with, so that requeue isn't clobbered.
      set((state) => (state.request === activeRequest ? { request: null, isPending: false } : { isPending: false }));
    }
  },
  handleCancel: () => set({ request: null, isPending: false }),
}));

/** Queue a confirmation dialog. `onConfirm` may be async; the modal shows a pending state until it settles. */
export const confirm = (options: ConfirmOptions): void => {
  useConfirmStore.setState({ request: options, isPending: false });
};
