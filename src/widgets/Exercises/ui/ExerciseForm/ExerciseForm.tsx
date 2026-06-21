'use client';

import { type FC } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/src/shared/ui';

import { useExerciseFormData } from './ExerciseForm.conf';
import type { ExerciseFormProps } from './ExerciseForm.types';
import { ExerciseFormFields } from './ui/ExerciseFormFields/ExerciseFormFields';

export const ExerciseForm: FC<ExerciseFormProps> = ({ open, exerciseId, readOnly = false, onOpenChange }) => {
  const { t, isUpdate, exercise, exerciseName, isLoadingExercise, isLoadError } = useExerciseFormData({
    open,
    exerciseId,
  });

  const title = isUpdate ? exerciseName || t('form.updateTitle') : t('form.title');
  const description = isUpdate ? t('form.updateDescription') : t('form.description');
  const submitLabel = isUpdate ? t('form.update') : t('form.submit');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {isLoadingExercise ? (
          <div className="flex flex-1 items-center justify-center" role="status" aria-live="polite">
            <Loader2 className="text-muted-foreground animate-spin" aria-hidden />
            <span className="sr-only">{t('form.loading')}</span>
          </div>
        ) : isLoadError ? (
          <p className="text-destructive flex-1 px-4 text-sm" role="alert">
            {t('form.loadError')}
          </p>
        ) : (
          <ExerciseFormFields
            key={exerciseId ?? 'create'}
            exerciseId={exerciseId}
            exercise={exercise}
            readOnly={readOnly}
            submitLabel={submitLabel}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
