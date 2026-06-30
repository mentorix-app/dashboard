'use client';

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useProgramDraftStore } from '@/src/entities/program';

import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';

/**
 * Mirrors the live form values into the shared draft store so the wizard shell
 * can reflect completion and unsaved-change state without a server round-trip.
 * Receives the already-watched values so the form is only subscribed once.
 */
export const useProgramDraftSync = (
  programId: string,
  form: UseFormReturn<ProgramBasicsFormValues>,
  values: Partial<ProgramBasicsFormValues>
) => {
  const setDraft = useProgramDraftStore((state) => state.setDraft);

  useEffect(() => {
    setDraft(programId, form.getValues());
  }, [values, programId, setDraft, form]);
};
