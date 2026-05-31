'use client';

import { type FC } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/i18n';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/src/shared/ui';

import {
  EXERCISE_DIFFICULTY_OPTIONS,
  EXERCISE_EQUIPMENT_OPTIONS,
  EXERCISE_MUSCLE_GROUP_OPTIONS,
  EXERCISE_TYPE_OPTIONS,
} from '../../Exercises.constants';
import { useExerciseFormConfig } from './ExerciseForm.conf';
import type { ExerciseFormProps } from './ExerciseForm.types';
import { buildOptions } from './ExerciseForm.utils';
import { ExerciseLocalizedField } from './ui/ExerciseLocalizedField';
import { ExerciseSelectField } from './ui/ExerciseSelectField';
import { ExerciseTextField } from './ui/ExerciseTextField';

export const ExerciseForm: FC<ExerciseFormProps> = ({ open, onOpenChange }) => {
  const t = useTranslations('Exercises');
  const { form, isPending, handleSubmit } = useExerciseFormConfig({ onOpenChange });
  const { control } = form;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('form.title')}</SheetTitle>
          <SheetDescription>{t('form.description')}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <ExerciseLocalizedField
            control={control}
            label={t('form.name')}
            placeholder={t('form.namePlaceholder')}
            fields={[
              { locale: 'en', label: t('form.localeEn'), name: 'name' },
              { locale: 'ru', label: t('form.localeRu'), name: 'nameRu' },
            ]}
          />
          <ExerciseSelectField
            control={control}
            name="type"
            label={t('form.type')}
            placeholder={t('form.selectPlaceholder')}
            options={buildOptions(EXERCISE_TYPE_OPTIONS, (value) => t(`types.${value}`))}
          />
          <ExerciseSelectField
            control={control}
            name="muscleGroup"
            label={t('form.muscleGroup')}
            placeholder={t('form.selectPlaceholder')}
            options={buildOptions(EXERCISE_MUSCLE_GROUP_OPTIONS, (value) => t(`muscleGroups.${value}`))}
          />
          <ExerciseSelectField
            control={control}
            name="equipment"
            label={t('form.equipmentOptional')}
            placeholder={t('form.selectPlaceholder')}
            options={buildOptions(EXERCISE_EQUIPMENT_OPTIONS, (value) => t(`equipment.${value}`))}
          />
          <ExerciseSelectField
            control={control}
            name="difficulty"
            label={t('form.difficulty')}
            placeholder={t('form.selectPlaceholder')}
            options={buildOptions(EXERCISE_DIFFICULTY_OPTIONS, (value) => t(`difficulty.${value}`))}
          />
          <ExerciseLocalizedField
            control={control}
            multiline
            label={t('form.descriptionLabel')}
            placeholder={t('form.descriptionPlaceholder')}
            fields={[
              { locale: 'en', label: t('form.localeEn'), name: 'description' },
              { locale: 'ru', label: t('form.localeRu'), name: 'descriptionRu' },
            ]}
          />
          <ExerciseTextField
            control={control}
            name="videoUrl"
            type="url"
            label={t('form.videoUrl')}
            placeholder={t('form.urlPlaceholder')}
          />
          <ExerciseTextField
            control={control}
            name="previewImageUrl"
            type="url"
            label={t('form.previewImageUrl')}
            placeholder={t('form.urlPlaceholder')}
          />
          <SheetFooter className="px-0">
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {t('form.submit')}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                {t('form.cancel')}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
