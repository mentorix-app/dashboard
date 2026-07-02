'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useTranslations } from '@/i18n';
import { buildProgramPatch, ProgramStatus, useUpdateProgram, type Program } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';

/**
 * Persists changed basics fields on blur and once more on unmount (e.g. when
 * leaving the step). Enabled for draft and published programs; archived
 * programs are read-only so nothing is ever saved.
 */
export const useProgramAutosave = (
  programId: string,
  form: UseFormReturn<ProgramBasicsFormValues>,
  program: Program | undefined,
  hydratedRef: RefObject<boolean>
) => {
  const t = useTranslations('ProgramWizard');
  const { showErrorToast } = useToast();
  const updateMutation = useUpdateProgram();

  const canEdit = program ? program.status !== ProgramStatus.Archived : false;

  const saveIfDirty = () => {
    if (!program || !canEdit || !hydratedRef.current) return;

    const patch = buildProgramPatch(form.getValues(), program);
    if (Object.keys(patch).length === 0) return;

    updateMutation.mutate({ id: programId, params: patch }, { onError: () => showErrorToast(t('toast.saveError')) });
  };

  // Keep the latest flush in a ref so the unmount cleanup stays current without
  // re-subscribing each render.
  const flushRef = useRef<() => void>(() => {});
  useEffect(() => {
    flushRef.current = saveIfDirty;
  });

  // Flush pending edits when leaving the step so nothing is lost.
  useEffect(() => () => flushRef.current(), []);

  return { isSaving: updateMutation.isPending, onBlur: saveIfDirty };
};
