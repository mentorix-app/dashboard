const enc = encodeURIComponent;

/** POST target for creating a `single` block and for merge/reorder day-level ops. */
export const dayBlocksPath = (programId: string, weekId: string, dayId: string) =>
  `/programs/${enc(programId)}/weeks/${enc(weekId)}/days/${enc(dayId)}/blocks`;

/** Block-scoped base path (block ids are unique within a week). */
export const blockPath = (programId: string, weekId: string, blockId: string) =>
  `/programs/${enc(programId)}/weeks/${enc(weekId)}/blocks/${enc(blockId)}`;

export const blockExercisesPath = (programId: string, weekId: string, blockId: string) =>
  `${blockPath(programId, weekId, blockId)}/exercises`;
