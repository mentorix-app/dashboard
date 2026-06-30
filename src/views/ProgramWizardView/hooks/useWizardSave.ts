'use client';

import { useState } from 'react';

/**
 * Owns the "save changes" confirmation modal for an already-published or
 * archived program. The combined structure-save endpoint is not defined yet,
 * so confirming simply closes the modal — basics changes autosave on their own
 * and structure edits persist through their per-action mutations.
 */
export const useWizardSave = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  return {
    isSaveModalOpen,
    openSaveModal: () => setIsSaveModalOpen(true),
    setSaveModalOpen: setIsSaveModalOpen,
    confirmSaveChanges: () => setIsSaveModalOpen(false),
    isSaving: false,
  };
};
