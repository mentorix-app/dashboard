'use client';

import { useLocale, useTranslations } from '@/i18n';
import { getExerciseName, useExercise } from '@/src/entities/exercise';

import type { ExerciseFormProps } from './ExerciseForm.types';

export const useExerciseFormData = ({ open, exerciseId }: Pick<ExerciseFormProps, 'open' | 'exerciseId'>) => {
  const t = useTranslations('Exercises');
  const locale = useLocale();
  const isUpdate = Boolean(exerciseId);

  const { data: exercise, isLoading, isError } = useExercise(open ? exerciseId : undefined);

  return {
    t,
    isUpdate,
    exercise,
    exerciseName: exercise ? getExerciseName(exercise, locale) : '',
    isLoadingExercise: isUpdate && isLoading,
    isLoadError: isUpdate && isError,
  };
};
