import { create } from 'zustand';

import type { ProgramDraftFields } from './types';

type ProgramBasicsDraftState = {
  programId: string | null;
  fields: ProgramDraftFields | null;
  setDraft: (programId: string, fields: ProgramDraftFields) => void;
  clear: () => void;
};

/**
 * Holds the live step-1 (basics) field values so the wizard shell can reflect
 * completion and unsaved-change state instantly, without waiting for a server
 * round-trip. Scoped by programId so values never leak between programs.
 */
export const useProgramBasicsDraftStore = create<ProgramBasicsDraftState>((set) => ({
  programId: null,
  fields: null,
  setDraft: (programId, fields) => set({ programId, fields }),
  clear: () => set({ programId: null, fields: null }),
}));
