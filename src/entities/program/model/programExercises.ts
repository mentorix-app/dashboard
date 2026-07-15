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

export type CreateProgramDayBlockResponse = ProgramDetail;
export type AddProgramBlockExerciseResponse = ProgramDetail;
export type UpdateProgramBlockExerciseResponse = ProgramDetail;
export type DeleteProgramBlockExerciseResponse = ProgramDetail;
