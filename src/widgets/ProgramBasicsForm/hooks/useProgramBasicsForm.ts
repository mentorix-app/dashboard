'use client';

import { useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { useTranslations } from '@/i18n';
import { toProgramDraftFields, useProgram, useProgramRevertSignalStore } from '@/src/entities/program';

import { PROGRAM_BASICS_DEFAULT_VALUES } from '../ProgramBasicsForm.constants';
import { createProgramBasicsSchema } from '../ProgramBasicsForm.schema';
import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';

/**
 * Builds the validated react-hook-form instance and hydrates it once from the
 * fetched program. A ref guards hydration so refetches never clobber edits —
 * except when the program's unpublished changes were just discarded, which
 * forces a re-hydration since the server data intentionally replaced the draft.
 */
export const useProgramBasicsForm = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const { data: program, isLoading } = useProgram(programId);
  const revertedAt = useProgramRevertSignalStore((state) => (state.programId === programId ? state.revertedAt : 0));

  const schema = useMemo(
    () =>
      createProgramBasicsSchema({
        nameRequired: t('validation.nameRequired'),
        descriptionRequired: t('validation.descriptionRequired'),
        selectRequired: t('validation.selectRequired'),
      }),
    [t]
  );

  const form = useForm<ProgramBasicsFormValues>({
    resolver: zodResolver(schema) as Resolver<ProgramBasicsFormValues>,
    defaultValues: PROGRAM_BASICS_DEFAULT_VALUES,
    mode: 'onChange',
  });

  const hydratedRef = useRef(false);
  const lastRevertedAtRef = useRef(revertedAt);
  useEffect(() => {
    if (revertedAt !== lastRevertedAtRef.current) {
      lastRevertedAtRef.current = revertedAt;
      hydratedRef.current = false;
    }
    if (!program || hydratedRef.current) return;
    form.reset(toProgramDraftFields(program));
    hydratedRef.current = true;
  }, [program, form, revertedAt]);

  return { t, form, program, isLoading, hydratedRef };
};
