import { create } from 'zustand';

type ProgramRevertSignalState = {
  programId: string | null;
  revertedAt: number;
  markReverted: (programId: string) => void;
};

/**
 * Bumped whenever a program's unpublished changes are discarded server-side
 * (the "Revert changes" action). The basics form only hydrates from the
 * fetched program once, so ordinary background refetches never clobber
 * in-progress edits — but a discard intentionally replaces the draft with the
 * published version, so that one case needs to force a re-hydration. Scoped
 * by programId so a stale counter from a previously edited program can't
 * trigger an unwanted reset after switching programs.
 */
export const useProgramRevertSignalStore = create<ProgramRevertSignalState>((set) => ({
  programId: null,
  revertedAt: 0,
  markReverted: (programId) => set((state) => ({ programId, revertedAt: state.revertedAt + 1 })),
}));
