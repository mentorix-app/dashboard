import type { ProgramDetail } from './structure';

/** Shared editable fields for a program exercise (camelCase → snake_case at the BFF). */
export type ProgramDayExerciseInput = {
  exerciseId: string;
  sets: string | null;
  reps: string | null;
  instruction: string;
};

/** Create a `single` block holding one exercise on a day. */
export type CreateProgramDayBlockVariables = {
  programId: string;
  weekId: string;
  dayId: string;
  exercise: ProgramDayExerciseInput;
};

/** Append an exercise to an existing (group) block. */
export type AddProgramBlockExerciseVariables = {
  programId: string;
  weekId: string;
  blockId: string;
} & ProgramDayExerciseInput;

export type UpdateProgramBlockExerciseVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  itemId: string;
} & ProgramDayExerciseInput;

export type DeleteProgramBlockExerciseVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  itemId: string;
};

/**
 * Duplicate an exercise. In a group the copy lands right after the original;
 * in a `single` block the copy becomes a new single right after it.
 */
export type DuplicateProgramBlockExerciseVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  itemId: string;
};

export type CreateProgramDayBlockResponse = ProgramDetail;
export type AddProgramBlockExerciseResponse = ProgramDetail;
export type UpdateProgramBlockExerciseResponse = ProgramDetail;
export type DeleteProgramBlockExerciseResponse = ProgramDetail;
export type DuplicateProgramBlockExerciseResponse = ProgramDetail;
