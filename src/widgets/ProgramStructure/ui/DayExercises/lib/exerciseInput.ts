import type { ProgramDayExerciseInput } from '@/src/entities/program';

/** Strip any character a volume field can't contain (keep digits, slash, dash). */
export const sanitizeVolumeInput = (value: string): string => String(value ?? '').replace(/[^0-9/-]/g, '');

/** Canonicalize a volume field: sanitize + trim; blank becomes null. */
export const toVolumeField = (value: string | null | undefined): string | null => {
  const cleaned = sanitizeVolumeInput(value ?? '').trim();
  return cleaned === '' ? null : cleaned;
};

/** Render a nullable volume field value back into its input string. */
export const formatVolumeField = (value: string | null | undefined): string => (value == null ? '' : String(value));

/**
 * Canonicalize an exercise input the same way the row's live edits are derived
 * (sanitized volume fields + trimmed instruction), so server data that never
 * changed compares equal and the row does not persist a no-op update.
 */
export const normalizeExerciseInput = (input: ProgramDayExerciseInput): ProgramDayExerciseInput => ({
  exerciseId: input.exerciseId,
  sets: toVolumeField(input.sets),
  reps: toVolumeField(input.reps),
  instruction: (input.instruction ?? '').trim(),
});

/** True when two exercise inputs carry the same editable values. */
export const isSameExerciseInput = (a: ProgramDayExerciseInput, b: ProgramDayExerciseInput): boolean =>
  a.sets === b.sets && a.reps === b.reps && a.instruction === b.instruction;

/**
 * Applies the block's sets policy: in a block type without sets the input
 * always carries `sets: null`, so a stale local value never reaches the API
 * (which rejects non-empty sets there).
 */
export const applySetsPolicy = (input: ProgramDayExerciseInput, allowSets: boolean): ProgramDayExerciseInput =>
  allowSets ? input : { ...input, sets: null };
