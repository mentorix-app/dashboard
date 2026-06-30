'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { useTranslations } from '@/i18n';
import { buildProgramPatch, ProgramStatus, useUpdateProgram, type Program } from '@/src/entities/program';
import { useDebouncedValue, useToast } from '@/src/shared/hooks';

import { AUTOSAVE_DELAY_MS } from '../ProgramBasicsForm.constants';
import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';

type AutosaveDeps = {
  program?: Program;
  getValues: () => ProgramBasicsFormValues;
  mutate: ReturnType<typeof useUpdateProgram>['mutate'];
  onError: () => void;
};

/**
 * Silently persists changed fields while the program is still a draft. For
 * published/archived programs autosave is disabled so edits stay local until
 * the user explicitly confirms a save in the wizard shell.
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

  const isDraft = program?.status === ProgramStatus.Draft;

  const watchedValues = useWatch({ control: form.control });
  const debouncedValues = useDebouncedValue(watchedValues, AUTOSAVE_DELAY_MS);

  // Keep non-stable deps in a ref so the save effect depends only on the
  // debounced values without re-subscribing each render.
  const depsRef = useRef<AutosaveDeps>({
    program,
    getValues: form.getValues,
    mutate: updateMutation.mutate,
    onError: () => showErrorToast(t('toast.saveError')),
  });
  useEffect(() => {
    depsRef.current = {
      program,
      getValues: form.getValues,
      mutate: updateMutation.mutate,
      onError: () => showErrorToast(t('toast.saveError')),
    };
  });

  const saveIfDirty = (ref: RefObject<boolean>) => {
    const { program: current, getValues, mutate, onError } = depsRef.current;
    if (!current || !ref.current) return;

    const patch = buildProgramPatch(getValues(), current);
    if (Object.keys(patch).length === 0) return;

    mutate({ id: programId, params: patch }, { onError });
  };

  useEffect(() => {
    if (isDraft) saveIfDirty(hydratedRef);
    // saveIfDirty/depsRef are intentionally read from refs; rerun on new values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues, programId, isDraft]);

  // Flush pending edits when leaving the step so nothing is lost.
  useEffect(
    () => () => {
      if (isDraft) saveIfDirty(hydratedRef);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [programId, isDraft]
  );

  return { isSaving: updateMutation.isPending };
};
