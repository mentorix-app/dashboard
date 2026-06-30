import { create } from 'zustand';

import type { ProgramWeek } from './structure.types';

type StructureState = {
  programId: string | null;
  weeks: ProgramWeek[];
  /** Seeds (or re-seeds) the working weeks from a freshly fetched program. */
  setWeeks: (programId: string, weeks: ProgramWeek[]) => void;
  setWorkingWeeks: (weeks: ProgramWeek[]) => void;
  clear: () => void;
};

/**
 * In-memory working copy of the week list for published/archived programs,
 * which edit their structure locally until an explicit save. Scoped by
 * programId so values never leak between programs. Intentionally has no
 * persistence middleware — state is dropped on reload by design.
 */
export const useProgramStructureStore = create<StructureState>((set) => ({
  programId: null,
  weeks: [],
  setWeeks: (programId, weeks) => set({ programId, weeks }),
  setWorkingWeeks: (weeks) => set({ weeks }),
  clear: () => set({ programId: null, weeks: [] }),
}));
