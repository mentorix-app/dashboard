'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { useTranslations } from '@/i18n';
import { useCreateExercise, useUpdateExercise, type Exercise } from '@/src/entities/exercise';
import { parseQuotaError } from '@/src/entities/subscription';
import { useToast } from '@/src/shared/hooks';

import { EXERCISE_FORM_DEFAULT_VALUES } from '../../ExerciseForm.constants';
import { createExerciseSchema } from '../../ExerciseForm.schema';
import type { ExerciseFormValues } from '../../ExerciseForm.types';
import { toCreateExerciseParams, toExerciseFormValues } from '../../ExerciseForm.utils';

type UseExerciseFormFieldsConfigParams = {
  exerciseId?: string;
  exercise?: Exercise;
  onSuccess: () => void;
};

export const useExerciseFormFieldsConfig = ({ exerciseId, exercise, onSuccess }: UseExerciseFormFieldsConfigParams) => {
  const t = useTranslations('Exercises');
  const { showSuccessToast, showErrorToast } = useToast();

  const createMutation = useCreateExercise();
  const updateMutation = useUpdateExercise();

  const schema = useMemo(
    () =>
      createExerciseSchema({
        nameMin: t('form.validation.nameMin'),
        selectRequired: t('form.validation.selectRequired'),
        urlInvalid: t('form.validation.urlInvalid'),
        youtubeUrlInvalid: t('form.validation.youtubeUrlInvalid'),
      }),
    [t]
  );

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(schema) as Resolver<ExerciseFormValues>,
    defaultValues: exercise ? toExerciseFormValues(exercise) : EXERCISE_FORM_DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<ExerciseFormValues> = (values) => {
    const params = toCreateExerciseParams(values);

    if (exerciseId) {
      updateMutation.mutate(
        { id: exerciseId, params },
        {
          onSuccess: () => {
            showSuccessToast(t('toast.updateSuccess'));
            onSuccess();
          },
          // Quota (409) errors are surfaced by the global handler; avoid a duplicate toast.
          onError: (error) => {
            if (!parseQuotaError(error)) showErrorToast(t('toast.updateError'));
          },
        }
      );
      return;
    }

    createMutation.mutate(params, {
      onSuccess: () => {
        showSuccessToast(t('toast.createSuccess'));
        onSuccess();
      },
      // Quota (409) errors are surfaced by the global handler; avoid a duplicate toast.
      onError: (error) => {
        if (!parseQuotaError(error)) showErrorToast(t('toast.createError'));
      },
    });
  };

  return {
    form,
    isPending: createMutation.isPending || updateMutation.isPending,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
