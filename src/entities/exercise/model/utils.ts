import type { Exercise } from './types';

const RU_LOCALE = 'ru';

const pickLocalized = (base: string, ru: string, locale: string): string => {
  if (locale === RU_LOCALE) return ru.trim() || base;
  return base;
};

export const getExerciseName = (exercise: Exercise, locale: string): string =>
  pickLocalized(exercise.name, exercise.nameRu, locale);

export const getExerciseDescription = (exercise: Exercise, locale: string): string =>
  pickLocalized(exercise.description, exercise.descriptionRu, locale);
