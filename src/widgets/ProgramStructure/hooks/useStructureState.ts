'use client';

import { useEffect } from 'react';
import { ProgramStatus, useProgram, useProgramStructureStore, type ProgramWeek } from '@/src/entities/program';

/**
 * Resolves the week list shown by the structure editor and its edit mode.
 * Draft programs read straight from the (server-backed) query cache; published
 * and archived programs edit an in-memory working copy seeded from the program.
 */
export const useStructureState = (programId: string) => {
  const { data: program, isLoading } = useProgram(programId);
  const storeProgramId = useProgramStructureStore((state) => state.programId);
  const storeWeeks = useProgramStructureStore((state) => state.weeks);
  const setWeeks = useProgramStructureStore((state) => state.setWeeks);
  const clear = useProgramStructureStore((state) => state.clear);

  const isDraft = (program?.status ?? ProgramStatus.Draft) === ProgramStatus.Draft;
  const isSeeded = storeProgramId === programId;

  useEffect(() => {
    if (!program || isDraft || isSeeded) return;
    setWeeks(programId, program.weeks);
  }, [program, isDraft, isSeeded, programId, setWeeks]);

  // Drop the working copy on unmount so a later program never reads this one's.
  useEffect(() => clear, [clear]);

  const weeks: ProgramWeek[] = isDraft ? (program?.weeks ?? []) : isSeeded ? storeWeeks : (program?.weeks ?? []);

  return { program, isLoading, isDraft, weeks };
};
