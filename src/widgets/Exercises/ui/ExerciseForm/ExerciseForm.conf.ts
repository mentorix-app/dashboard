'use client';

import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { useLocale, useTranslations } from '@/i18n';
import { getExerciseName, useCreateExercise, useExercise, useUpdateExercise } from '@/src/entities/exercise';

import { EXERCISE_FORM_DEFAULT_VALUES } from './ExerciseForm.constants';
import { createExerciseSchema } from './ExerciseForm.schema';
import type { ExerciseFormProps, ExerciseFormValues } from './ExerciseForm.types';
import { toCreateExerciseParams, toExerciseFormValues } from './ExerciseForm.utils';

export const useExerciseFormConfig = ({ open, exerciseId, onOpenChange }: ExerciseFormProps) => {
  const t = useTranslations('Exercises');
  const locale = useLocale();
  const isUpdate = Boolean(exerciseId);

  const createMutation = useCreateExercise();
  const updateMutation = useUpdateExercise();
  const {
    data: exercise,
    isLoading: isLoadingExercise,
    isError: isLoadError,
  } = useExercise(open ? exerciseId : undefined);

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

  useEffect(() => {
    if (!open) return;
    if (!exerciseId) {
      form.reset(EXERCISE_FORM_DEFAULT_VALUES);
      return;
    }
    if (exercise) form.reset(toExerciseFormValues(exercise));
  }, [open, exerciseId, exercise, form]);

  const handleValidSubmit: SubmitHandler<ExerciseFormValues> = (values) => {
    const params = toCreateExerciseParams(values);

    if (exerciseId) {
      updateMutation.mutate({ id: exerciseId, params }, { onSuccess: () => onOpenChange(false) });
      return;
    }

    createMutation.mutate(params, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return {
    form,
    isUpdate,
    exerciseName: exercise ? getExerciseName(exercise, locale) : '',
    isLoadingExercise: isUpdate && isLoadingExercise,
    isLoadError: isUpdate && isLoadError,
    isPending: createMutation.isPending || updateMutation.isPending,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
