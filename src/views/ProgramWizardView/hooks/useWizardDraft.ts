'use client';

import { useEffect } from 'react';
import { useLocale } from '@/i18n';
import { getProgramName, ProgramStatus, useProgramBasicsDraftStore, type ProgramDetail } from '@/src/entities/program';

import { getCompletionPercent, getMissingRequiredFields, getStructureErrors } from '../ProgramWizardView.utils';

/**
 * Derives the wizard's progress and status from the live draft (when present)
 * or the persisted program, and clears the shared draft on unmount so a later
 * program never reads the previous one's values.
 */
export const useWizardDraft = (programId: string, program: ProgramDetail | undefined) => {
  const locale = useLocale();
  const draftProgramId = useProgramBasicsDraftStore((state) => state.programId);
  const draftFields = useProgramBasicsDraftStore((state) => state.fields);
  const clearDraft = useProgramBasicsDraftStore((state) => state.clear);
  const fields = draftProgramId === programId ? draftFields : null;

  useEffect(() => clearDraft, [clearDraft]);

  // Drive progress and the header title from the live draft when available so
  // they react instantly to typing instead of waiting for a save round-trip.
  const progressSource = fields ?? program;
  const missingFields = getMissingRequiredFields(progressSource);
  const completionPercent = getCompletionPercent(progressSource, program?.weeks);
  const structureErrors = getStructureErrors(program?.weeks);

  const status = program?.status ?? ProgramStatus.Draft;
  const isDraft = status === ProgramStatus.Draft;
  const displayName = getProgramName(fields ?? program ?? { name: '', nameRu: '' }, locale);

  return {
    missingFields,
    completionPercent,
    status,
    isDraft,
    displayName,
    structureErrors,
  };
};
