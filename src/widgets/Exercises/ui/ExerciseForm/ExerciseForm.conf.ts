'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { useTranslations } from '@/i18n';
import { useCreateExercise } from '@/src/entities/exercise';

import { EXERCISE_FORM_DEFAULT_VALUES } from './ExerciseForm.constants';
import { createExerciseSchema } from './ExerciseForm.schema';
import type { ExerciseFormProps, ExerciseFormValues } from './ExerciseForm.types';
import { toCreateExerciseParams } from './ExerciseForm.utils';

export const useExerciseFormConfig = ({ onOpenChange }: Pick<ExerciseFormProps, 'onOpenChange'>) => {
  const t = useTranslations('Exercises');
  const { mutate, isPending } = useCreateExercise();

  const schema = useMemo(
    () =>
      createExerciseSchema({
        nameMin: t('form.validation.nameMin'),
        descriptionMin: t('form.validation.descriptionMin'),
        selectRequired: t('form.validation.selectRequired'),
        urlInvalid: t('form.validation.urlInvalid'),
      }),
    [t]
  );

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(schema) as Resolver<ExerciseFormValues>,
    defaultValues: EXERCISE_FORM_DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<ExerciseFormValues> = (values) => {
    mutate(toCreateExerciseParams(values));
    onOpenChange(false);
    form.reset();
  };

  return { form, isPending, handleSubmit: form.handleSubmit(handleValidSubmit) };
};
