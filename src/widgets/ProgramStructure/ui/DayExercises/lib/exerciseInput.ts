import type { ProgramDayExerciseInput } from '@/src/entities/program';

/** Parse a whole-number field (sets/reps): blank or invalid/negative → null. */
export const parseCountField = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
};

/** Render a nullable numeric field value back into its input string. */
export const formatNumberField = (value: number | null | undefined): string => (value == null ? '' : String(value));

/**
 * Canonicalize an exercise input the same way the row's live edits are derived
 * (number round-trip + trimmed instruction), so server data that never changed
 * compares equal and the row does not persist a no-op update.
 */
export const normalizeExerciseInput = (input: ProgramDayExerciseInput): ProgramDayExerciseInput => ({
  exerciseId: input.exerciseId,
  sets: parseCountField(formatNumberField(input.sets)),
  reps: parseCountField(formatNumberField(input.reps)),
  instruction: (input.instruction ?? '').trim(),
});

/** True when two exercise inputs carry the same editable values. */
export const isSameExerciseInput = (a: ProgramDayExerciseInput, b: ProgramDayExerciseInput): boolean =>
  a.sets === b.sets && a.reps === b.reps && a.instruction === b.instruction;
