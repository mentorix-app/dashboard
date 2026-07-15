import type { Program } from './types';

export enum ProgramBlockType {
  Single = 'single',
  Emom = 'emom',
  Amrap = 'amrap',
  ForTime = 'for_time',
  Intervals = 'intervals',
  Chipper = 'chipper',
  Ladder = 'ladder',
  DeathBy = 'death_by',
  Superset = 'superset',
  Complex = 'complex',
  SkillWork = 'skill_work',
  Strength = 'strength',
  Conditioning = 'conditioning',
  Gymnastics = 'gymnastics',
  Weightlifting = 'weightlifting',
}

/** Group block types (every type except `single`); used by merge/patch flows. */
export const GROUP_BLOCK_TYPES = [
  ProgramBlockType.Emom,
  ProgramBlockType.Amrap,
  ProgramBlockType.ForTime,
  ProgramBlockType.Intervals,
  ProgramBlockType.Chipper,
  ProgramBlockType.Ladder,
  ProgramBlockType.DeathBy,
  ProgramBlockType.Superset,
  ProgramBlockType.Complex,
  ProgramBlockType.SkillWork,
  ProgramBlockType.Strength,
  ProgramBlockType.Conditioning,
  ProgramBlockType.Gymnastics,
  ProgramBlockType.Weightlifting,
] as const;

export type ProgramBlockGroupType = (typeof GROUP_BLOCK_TYPES)[number];

/**
 * A single exercise placed inside a block on a program day (camelCase shape
 * after the BFF converts the snake_case API payload).
 */
export type ProgramDayExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameRu: string;
  sortOrder: number;
  /** Free-form volume text (e.g. "3", "5/4", "3-6"), or null when unset. */
  sets: string | null;
  reps: string | null;
  instruction: string;
  createdAt: string;
};

/**
 * A work block on a program day. A `single` block always holds exactly one
 * exercise; group blocks (emom, amrap, superset, …) hold one or more.
 */
export type ProgramDayBlock = {
  id: string;
  blockType: ProgramBlockType;
  instruction: string;
  sortOrder: number;
  exercises: ProgramDayExercise[];
  createdAt: string;
};

export type ProgramDay = {
  id: string;
  dayNumber: number;
  sortOrder: number;
  blocks: ProgramDayBlock[];
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
 * publish endpoints, including its nested week → day → block → exercise tree.
 */
export type ProgramDetail = Program & {
  weeks: ProgramWeek[];
};
