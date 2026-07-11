import type { ReactNode } from 'react';

export type ProgramPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Receives the chosen program id when the user confirms. */
  onConfirm: (programId: string) => void;
  /** Called when the user clears the client's current program (assigns none). */
  onRemove?: () => void;
  /** Currently assigned program id, used to preselect and enable removal. */
  selectedProgramId?: string | null;
  /** Optional content rendered above the list (e.g. a bulk overwrite warning). */
  notice?: ReactNode;
  /**
   * Force-enables the remove action even without a single `selectedProgramId`.
   * Used by bulk assign, where the remove clears programs for many clients.
   */
  removable?: boolean;
};
