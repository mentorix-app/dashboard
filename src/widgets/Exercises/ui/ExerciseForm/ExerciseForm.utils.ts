import type { CreateExerciseParams } from '@/src/entities/exercise';

import type { ExerciseFormValues } from './ExerciseForm.types';

export type ExerciseFormOption = { value: string; label: string };

export const buildOptions = <T extends string>(
  values: readonly T[],
  getLabel: (value: T) => string
): ExerciseFormOption[] => values.map((value) => ({ value, label: getLabel(value) }));

export const toCreateExerciseParams = (values: ExerciseFormValues): CreateExerciseParams => ({
  name: values.name.trim(),
  nameRu: values.nameRu.trim(),
  description: values.description.trim(),
  descriptionRu: values.descriptionRu.trim(),
  type: values.type as Exclude<ExerciseFormValues['type'], ''>,
  muscleGroup: values.muscleGroup as Exclude<ExerciseFormValues['muscleGroup'], ''>,
  equipment: values.equipment === '' ? undefined : values.equipment,
  difficulty: values.difficulty as Exclude<ExerciseFormValues['difficulty'], ''>,
  videoUrl: values.videoUrl.trim(),
  previewImageUrl: values.previewImageUrl.trim(),
});
