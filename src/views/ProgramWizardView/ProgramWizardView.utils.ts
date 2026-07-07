import type { ProgramDay, ProgramWeek } from '@/src/entities/program';

import { PROGRAM_REQUIRED_FIELDS } from './ProgramWizardView.constants';
import type { ProgramRequiredField, ProgramWizardStep, StructureErrorKey } from './ProgramWizardView.types';

type ProgramRequiredSource = Partial<Record<ProgramRequiredField, string | null>>;

export const resolveStep = (pathname: string): ProgramWizardStep =>
  pathname.endsWith('/structure') ? 'structure' : 'basics';

const isFieldFilled = (value: string | null | undefined): boolean => {
  if (value == null) return false;
  return value.trim().length > 0;
};

/**
 * Returns the required fields that are still empty. When the source has not
 * loaded yet, every field counts as missing so progress starts at 0%. Accepts
 * either a persisted program or the live draft fields from the store.
 */
export const getMissingRequiredFields = (source?: ProgramRequiredSource): ProgramRequiredField[] => {
  if (!source) return [...PROGRAM_REQUIRED_FIELDS];
  return PROGRAM_REQUIRED_FIELDS.filter((field) => !isFieldFilled(source[field]));
};

/** A day counts as complete once it holds at least one exercise. */
const isDayFilled = (day: ProgramDay): boolean => day.blocks.some((block) => block.exercises.length > 0);

/**
 * Counts the structure progress units: one per day across every week, with a
 * day considered filled once it has at least one exercise.
 */
export const getStructureUnits = (weeks?: ProgramWeek[]): { total: number; filled: number } => {
  const days = (weeks ?? []).flatMap((week) => week.days);
  return { total: days.length, filled: days.filter(isDayFilled).length };
};

/**
 * Overall wizard completion: the required step-1 fields plus every day in the
 * structure (each day filled once it has an exercise). Weeks are optional so
 * callers without structure data fall back to step-1 progress only.
 */
export const getCompletionPercent = (source?: ProgramRequiredSource, weeks?: ProgramWeek[]): number => {
  const basicsTotal = PROGRAM_REQUIRED_FIELDS.length;
  const basicsFilled = basicsTotal - getMissingRequiredFields(source).length;
  const structure = getStructureUnits(weeks);

  const total = basicsTotal + structure.total;
  const filled = basicsFilled + structure.filled;
  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
};

/**
 * Validates the structure against the backend publish rules: every week needs at
 * least one day with exercises, and every exercise needs both sets and reps.
 * Returns the distinct rule keys that are currently violated.
 */
export const getStructureErrors = (weeks?: ProgramWeek[]): StructureErrorKey[] => {
  const list = weeks ?? [];
  const errors: StructureErrorKey[] = [];

  const everyWeekHasExercises = list.length > 0 && list.every((week) => week.days.some(isDayFilled));
  if (!everyWeekHasExercises) errors.push('weekWithoutExercises');

  const hasIncompleteExercise = list.some((week) =>
    week.days.some((day) =>
      day.blocks.some((block) => block.exercises.some((exercise) => exercise.sets == null || exercise.reps == null))
    )
  );
  if (hasIncompleteExercise) errors.push('exerciseMissingCount');

  return errors;
};
