// Import the enum value from the direct module (not the entities barrel) so Jest
// never pulls the next-intl ESM graph in when unit-testing the drag logic.
import { ProgramBlockType, type ProgramDayBlock } from '@/src/entities/program/model/structure';

export const BLOCK_DND_PREFIX = 'B:';
export const EXERCISE_DND_PREFIX = 'E:';
export const CONTAINER_DND_PREFIX = 'C:';

/** Ordered exercise ids per group block. Singles live on the block plane and are excluded. */
export type GroupLanes = Record<string, string[]>;

export const isGroupBlock = (block: ProgramDayBlock) => block.blockType !== ProgramBlockType.Single;
export const findBlock = (blocks: ProgramDayBlock[], id: string) => blocks.find((block) => block.id === id);
export const findBlockByExercise = (blocks: ProgramDayBlock[], exerciseId: string) =>
  blocks.find((block) => block.exercises.some((exercise) => exercise.id === exerciseId));

const findLaneOf = (lanes: GroupLanes, exerciseId: string): string | null => {
  for (const [blockId, ids] of Object.entries(lanes)) if (ids.includes(exerciseId)) return blockId;
  return null;
};

/** Live exercise order of each group block, keyed for cross-lane drag previews. */
export const buildGroupLanes = (blocks: ProgramDayBlock[]): GroupLanes =>
  Object.fromEntries(
    blocks.filter(isGroupBlock).map((block) => [block.id, block.exercises.map((exercise) => exercise.id)])
  );

/**
 * onDragOver reducer used purely for the visual gap: it re-homes the active
 * exercise into the hovered group's lane. Same-lane hovers are left untouched so
 * the group's own SortableContext animates the shift. The drop itself is resolved
 * from the server tree, so a glitch here can never corrupt data.
 */
export const applyDragOver = (lanes: GroupLanes, activeId: string, overId: string): GroupLanes => {
  if (!activeId.startsWith(EXERCISE_DND_PREFIX)) return lanes;
  const activeExerciseId = activeId.slice(2);
  const sourceLaneId = findLaneOf(lanes, activeExerciseId);
  if (!sourceLaneId) return lanes;

  let targetLaneId: string | null = null;
  let overExerciseId: string | null = null;
  if (overId.startsWith(CONTAINER_DND_PREFIX)) targetLaneId = overId.slice(2);
  else if (overId.startsWith(EXERCISE_DND_PREFIX)) {
    overExerciseId = overId.slice(2);
    targetLaneId = findLaneOf(lanes, overExerciseId);
  }
  if (!targetLaneId || targetLaneId === sourceLaneId || !(targetLaneId in lanes)) return lanes;

  const source = (lanes[sourceLaneId] ?? []).filter((id) => id !== activeExerciseId);
  const target = [...(lanes[targetLaneId] ?? [])];
  const insertAt = overExerciseId ? Math.max(target.indexOf(overExerciseId), 0) : target.length;
  target.splice(insertAt, 0, activeExerciseId);
  return { ...lanes, [sourceLaneId]: source, [targetLaneId]: target };
};

/** The group block a drag is currently over (via its container or one of its exercises), or null. */
export const groupTargetId = (blocks: ProgramDayBlock[], overId: string): string | null => {
  if (overId.startsWith(CONTAINER_DND_PREFIX)) {
    const block = findBlock(blocks, overId.slice(2));
    return block && isGroupBlock(block) ? block.id : null;
  }
  if (overId.startsWith(EXERCISE_DND_PREFIX)) {
    const owner = findBlockByExercise(blocks, overId.slice(2));
    return owner && isGroupBlock(owner) ? owner.id : null;
  }
  return null;
};
