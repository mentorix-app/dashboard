import type { ProgramDetail } from '../model/structure.types';

/** Shared editable fields for a program-day exercise (camelCase → snake_case at the BFF). */
export type ProgramDayExerciseInput = {
  exerciseId: string;
  sets: number | null;
  reps: number | null;
  weightKg: number | null;
  instruction: string;
};

export type AddProgramDayExerciseVariables = {
  programId: string;
  weekId: string;
  dayId: string;
} & ProgramDayExerciseInput;

export type UpdateProgramDayExerciseVariables = {
  programId: string;
  weekId: string;
  dayId: string;
  itemId: string;
} & ProgramDayExerciseInput;

export type DeleteProgramDayExerciseVariables = {
  programId: string;
  weekId: string;
  dayId: string;
  itemId: string;
};

/** One day's full, ordered list of exercise item ids for the week-level reorder/move. */
export type ProgramWeekExerciseDayOrder = {
  dayId: string;
  exerciseItemIds: string[];
};

export type ReorderProgramWeekExercisesVariables = {
  programId: string;
  weekId: string;
  days: ProgramWeekExerciseDayOrder[];
};

export type AddProgramDayExerciseResponse = ProgramDetail;
export type UpdateProgramDayExerciseResponse = ProgramDetail;
export type DeleteProgramDayExerciseResponse = ProgramDetail;
export type ReorderProgramWeekExercisesResponse = ProgramDetail;
