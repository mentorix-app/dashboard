import type { ProgramBlockGroupType, ProgramDetail } from './structure';

/** Merge two or more sibling blocks on a day into one group (defaults to `complex`). */
export type MergeProgramDayBlocksVariables = {
  programId: string;
  weekId: string;
  dayId: string;
  blockIds: string[];
};

/** Change a group block's type and/or instruction. `single` cannot be set here. */
export type PatchProgramDayBlockVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  blockType?: ProgramBlockGroupType;
  instruction?: string;
};

/** Fully replaces the clients allowed to see a block; an empty list makes it shared. */
export type SetProgramDayBlockClientsVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  clientUserIds: string[];
};

export type UngroupProgramDayBlockVariables = {
  programId: string;
  weekId: string;
  blockId: string;
};

export type DeleteProgramDayBlockVariables = {
  programId: string;
  weekId: string;
  blockId: string;
};

export type ReorderProgramDayBlocksVariables = {
  programId: string;
  weekId: string;
  dayId: string;
  blockIds: string[];
};

export type ReorderProgramBlockExercisesVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  exerciseItemIds: string[];
};

/** Move a whole block to another day of the same week. */
export type MoveProgramDayBlockVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  targetDayId: string;
  sortOrder?: number;
};

/** Pull an exercise out of a group into a new `single` block on the same day. */
export type ExtractProgramBlockExerciseVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  itemId: string;
  sortOrder?: number;
};

/** Move an exercise into another block of the same week. */
export type MoveProgramExerciseToBlockVariables = {
  programId: string;
  weekId: string;
  blockId: string;
  itemId: string;
  targetBlockId: string;
};

export type MergeProgramDayBlocksResponse = ProgramDetail;
export type PatchProgramDayBlockResponse = ProgramDetail;
export type SetProgramDayBlockClientsResponse = ProgramDetail;
export type UngroupProgramDayBlockResponse = ProgramDetail;
export type DeleteProgramDayBlockResponse = ProgramDetail;
export type ReorderProgramDayBlocksResponse = ProgramDetail;
export type ReorderProgramBlockExercisesResponse = ProgramDetail;
export type MoveProgramDayBlockResponse = ProgramDetail;
export type ExtractProgramBlockExerciseResponse = ProgramDetail;
export type MoveProgramExerciseToBlockResponse = ProgramDetail;
