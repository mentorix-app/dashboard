import type { Program } from './types';

/**
 * A single exercise placed on a day of the program (camelCase shape after the
 * BFF converts the snake_case API payload).
 */
export type ProgramDayExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameRu: string;
  sortOrder: number;
  sets: number | null;
  reps: number | null;
  weightKg: number | null;
  instruction: string;
  createdAt: string;
};

export type ProgramDay = {
  id: string;
  dayNumber: number;
  sortOrder: number;
  exercises: ProgramDayExercise[];
  createdAt: string;
};

export type ProgramWeek = {
  id: string;
  weekNumber: number;
  sortOrder: number;
  days: ProgramDay[];
  createdAt: string;
};

/**
 * Full program payload returned by GET /programs/{id} and the create/update/
 * publish endpoints, including its nested week → day → exercise structure.
 */
export type ProgramDetail = Program & {
  weeks: ProgramWeek[];
};
