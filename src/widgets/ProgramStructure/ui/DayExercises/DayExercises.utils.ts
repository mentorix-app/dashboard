import type { ProgramDayExerciseInput, ProgramWeek, ProgramWeekExerciseDayOrder } from '@/src/entities/program';

/** Parse a whole-number field (sets/reps): blank or invalid/negative → null. */
export const parseCountField = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
};

/** Parse the weight field: blank or invalid/negative → null; otherwise a non-negative float. */
export const parseWeightField = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number.parseFloat(trimmed);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
};

/** Render a nullable numeric field value back into its input string. */
export const formatNumberField = (value: number | null | undefined): string => (value == null ? '' : String(value));

/** True when two exercise inputs carry the same editable values. */
export const isSameExerciseInput = (a: ProgramDayExerciseInput, b: ProgramDayExerciseInput): boolean =>
  a.sets === b.sets && a.reps === b.reps && a.weightKg === b.weightKg && a.instruction === b.instruction;

/** The week's full day-by-day exercise order, as the reorder endpoint expects. */
export const buildDayOrders = (week: ProgramWeek): ProgramWeekExerciseDayOrder[] =>
  week.days.map((day) => ({ dayId: day.id, exerciseItemIds: day.exercises.map((exercise) => exercise.id) }));

/** Replace one day's order while keeping every other day untouched. */
export const withReorderedDay = (
  week: ProgramWeek,
  dayId: string,
  exerciseItemIds: string[]
): ProgramWeekExerciseDayOrder[] =>
  buildDayOrders(week).map((order) => (order.dayId === dayId ? { ...order, exerciseItemIds } : order));

/** Move one exercise item from one day to the end of another within the same week. */
export const withMovedExercise = (
  week: ProgramWeek,
  fromDayId: string,
  toDayId: string,
  itemId: string
): ProgramWeekExerciseDayOrder[] =>
  buildDayOrders(week).map((order) => {
    if (order.dayId === fromDayId) {
      return { ...order, exerciseItemIds: order.exerciseItemIds.filter((id) => id !== itemId) };
    }
    if (order.dayId === toDayId) {
      return { ...order, exerciseItemIds: [...order.exerciseItemIds, itemId] };
    }
    return order;
  });
