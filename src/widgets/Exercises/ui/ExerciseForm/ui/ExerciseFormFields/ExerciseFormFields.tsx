'use client';

import { type FC } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button, SheetClose, SheetFooter } from '@/src/shared/ui';
import type { Exercise } from '@/src/entities/exercise';

import {
  EXERCISE_DIFFICULTY_OPTIONS,
  EXERCISE_EQUIPMENT_OPTIONS,
  EXERCISE_MUSCLE_GROUP_OPTIONS,
  EXERCISE_TYPE_OPTIONS,
} from '../../../../Exercises.constants';
import { buildOptions } from '../../ExerciseForm.utils';
import { ExerciseLocalizedField } from '../ExerciseLocalizedField';
import { ExerciseSelectField } from '../ExerciseSelectField';
import { ExerciseTextField } from '../ExerciseTextField';
import { useExerciseFormFieldsConfig } from './ExerciseFormFields.conf';

type ExerciseFormFieldsProps = {
  exerciseId?: string;
  exercise?: Exercise;
  readOnly: boolean;
  submitLabel: string;
  onSuccess: () => void;
};

export const ExerciseFormFields: FC<ExerciseFormFieldsProps> = ({
  exerciseId,
  exercise,
  readOnly,
  submitLabel,
  onSuccess,
}) => {
  const t = useTranslations('Exercises');
  const { form, isPending, handleSubmit } = useExerciseFormFieldsConfig({ exerciseId, exercise, onSuccess });
  const { control } = form;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
      <ExerciseLocalizedField
        control={control}
        disabled={readOnly}
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
        disabled={readOnly}
        label={t('form.type')}
        placeholder={t('form.selectPlaceholder')}
        options={buildOptions(EXERCISE_TYPE_OPTIONS, (value) => t(`types.${value}`))}
      />
      <ExerciseSelectField
        control={control}
        name="muscleGroup"
        disabled={readOnly}
        label={t('form.muscleGroup')}
        placeholder={t('form.selectPlaceholder')}
        options={buildOptions(EXERCISE_MUSCLE_GROUP_OPTIONS, (value) => t(`muscleGroups.${value}`))}
      />
      <ExerciseSelectField
        control={control}
        name="equipment"
        disabled={readOnly}
        label={t('form.equipmentOptional')}
        placeholder={t('form.selectPlaceholder')}
        options={buildOptions(EXERCISE_EQUIPMENT_OPTIONS, (value) => t(`equipment.${value}`))}
      />
      <ExerciseSelectField
        control={control}
        name="difficulty"
        disabled={readOnly}
        label={t('form.difficulty')}
        placeholder={t('form.selectPlaceholder')}
        options={buildOptions(EXERCISE_DIFFICULTY_OPTIONS, (value) => t(`difficulty.${value}`))}
      />
      <ExerciseLocalizedField
        control={control}
        multiline
        disabled={readOnly}
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
        disabled={readOnly}
        label={t('form.videoUrl')}
        placeholder={t('form.urlPlaceholder')}
      />
      <ExerciseTextField
        control={control}
        name="previewImageUrl"
        type="url"
        disabled={readOnly}
        label={t('form.previewImageUrl')}
        placeholder={t('form.urlPlaceholder')}
      />
      <SheetFooter className="px-0">
        {!readOnly ? (
          <Button type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {submitLabel}
          </Button>
        ) : null}
        <SheetClose asChild>
          <Button type="button" variant="outline">
            {t('form.cancel')}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};
