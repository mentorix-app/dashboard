'use client';

import { ProgramStatus, useProgram, type ProgramWeek } from '@/src/entities/program';

/**
 * Resolves the week list shown by the structure editor and its edit mode. Every
 * program now reads straight from the server-backed query cache; archived
 * programs are surfaced as read-only via `canEdit`.
 */
export const useStructureState = (programId: string) => {
  const { data: program, isLoading } = useProgram(programId);

  const status = program?.status ?? ProgramStatus.Draft;
  const isDraft = status === ProgramStatus.Draft;
  const isArchived = status === ProgramStatus.Archived;
  const canEdit = !isArchived;

  const weeks: ProgramWeek[] = program?.weeks ?? [];

  return { program, isLoading, isDraft, isArchived, canEdit, weeks };
};
