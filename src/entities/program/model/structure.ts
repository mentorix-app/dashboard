import type { Program } from './types';

export enum ProgramBlockType {
  Single = 'single',
  Emom = 'emom',
  Amrap = 'amrap',
  ForTime = 'for_time',
  Intervals = 'intervals',
  Chipper = 'chipper',
  Superset = 'superset',
  SkillWork = 'skill_work',
  Strength = 'strength',
  Conditioning = 'conditioning',
  Gymnastics = 'gymnastics',
  Weightlifting = 'weightlifting',
}

/** Workout formats: timed or structured groups whose exercises carry no sets. */
export const FORMAT_BLOCK_TYPES = [
  ProgramBlockType.Emom,
  ProgramBlockType.Amrap,
  ProgramBlockType.ForTime,
  ProgramBlockType.Intervals,
  ProgramBlockType.Chipper,
  ProgramBlockType.Superset,
] as const;

/** Training sections: plain groups whose exercises keep their sets. */
export const SECTION_BLOCK_TYPES = [
  ProgramBlockType.SkillWork,
  ProgramBlockType.Strength,
  ProgramBlockType.Conditioning,
  ProgramBlockType.Gymnastics,
  ProgramBlockType.Weightlifting,
] as const;

/** Group block types (every type except `single`); used by merge/patch flows. */
export const GROUP_BLOCK_TYPES = [...FORMAT_BLOCK_TYPES, ...SECTION_BLOCK_TYPES] as const;

export type ProgramBlockGroupType = (typeof GROUP_BLOCK_TYPES)[number];

/** Default type the backend gives a freshly merged group. */
export const DEFAULT_GROUP_BLOCK_TYPE = ProgramBlockType.SkillWork;

/** Format settings of a block; each is null until the trainer sets it. Times are in seconds. */
export type ProgramBlockSettings = {
  rounds: number | null;
  durationSec: number | null;
  timeCapSec: number | null;
  workSec: number | null;
  restSec: number | null;
};

export type ProgramBlockSettingField = keyof ProgramBlockSettings;

/** Settings measured in seconds (every one except `rounds`). */
export type ProgramBlockDurationField = Exclude<ProgramBlockSettingField, 'rounds'>;

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
 * exercise; group blocks (emom, amrap, superset, …) hold one or more. Every
 * block carries all format settings; only the ones its type takes are set.
 */
export type ProgramDayBlock = ProgramBlockSettings & {
  id: string;
  blockType: ProgramBlockType;
  instruction: string;
  sortOrder: number;
  /** Empty means shared with every client assigned to the program. */
  clientUserIds: string[];
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
