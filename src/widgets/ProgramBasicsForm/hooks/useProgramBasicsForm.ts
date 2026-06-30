'use client';

import { useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { useTranslations } from '@/i18n';
import { toProgramDraftFields, useProgram } from '@/src/entities/program';

import { PROGRAM_BASICS_DEFAULT_VALUES } from '../ProgramBasicsForm.constants';
import { createProgramBasicsSchema } from '../ProgramBasicsForm.schema';
import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';

/**
 * Builds the validated react-hook-form instance and hydrates it once from the
 * fetched program. A ref guards hydration so refetches never clobber edits.
 */
export const useProgramBasicsForm = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const { data: program, isLoading } = useProgram(programId);

  const schema = useMemo(
    () =>
      createProgramBasicsSchema({
        nameRequired: t('validation.nameRequired'),
        descriptionRequired: t('validation.descriptionRequired'),
        selectRequired: t('validation.selectRequired'),
        imageRequired: t('validation.imageRequired'),
      }),
    [t]
  );

  const form = useForm<ProgramBasicsFormValues>({
    resolver: zodResolver(schema) as Resolver<ProgramBasicsFormValues>,
    defaultValues: PROGRAM_BASICS_DEFAULT_VALUES,
    mode: 'onChange',
  });

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!program || hydratedRef.current) return;
    form.reset(toProgramDraftFields(program));
    hydratedRef.current = true;
  }, [program, form]);

  return { t, form, program, isLoading, hydratedRef };
};
