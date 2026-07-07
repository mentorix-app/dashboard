import { arrayMove } from '@dnd-kit/sortable';

import { ProgramBlockType, type ProgramDayBlock } from '@/src/entities/program/model/structure';

import {
  BLOCK_DND_PREFIX,
  CONTAINER_DND_PREFIX,
  EXERCISE_DND_PREFIX,
  findBlock,
  findBlockByExercise,
  groupTargetId,
  isGroupBlock,
} from './dndLanes';

export type DragEndAction =
  | { type: 'reorderBlocks'; blockIds: string[] }
  | { type: 'reorderExercises'; blockId: string; itemIds: string[] }
  | { type: 'moveExercise'; sourceBlockId: string; itemId: string; targetBlockId: string }
  | { type: 'none' };

const resolveBlockDragEnd = (blocks: ProgramDayBlock[], activeId: string, overId: string): DragEndAction => {
  const active = findBlock(blocks, activeId.slice(2));
  if (!active) return { type: 'none' };

  if (overId.startsWith(BLOCK_DND_PREFIX)) {
    const blockIds = blocks.map((block) => block.id);
    const from = blockIds.indexOf(active.id);
    const to = blockIds.indexOf(overId.slice(2));
    if (from === -1 || to === -1 || from === to) return { type: 'none' };
    return { type: 'reorderBlocks', blockIds: arrayMove(blockIds, from, to) };
  }

  // A single dropped onto a group hands its lone exercise over to that group.
  if (active.blockType !== ProgramBlockType.Single) return { type: 'none' };
  const exercise = active.exercises[0];
  const targetBlockId = groupTargetId(blocks, overId);
  if (!exercise || !targetBlockId || targetBlockId === active.id) return { type: 'none' };
  return { type: 'moveExercise', sourceBlockId: active.id, itemId: exercise.id, targetBlockId };
};

const resolveExerciseDragEnd = (blocks: ProgramDayBlock[], activeId: string, overId: string): DragEndAction => {
  const itemId = activeId.slice(2);
  const source = findBlockByExercise(blocks, itemId);
  if (!source) return { type: 'none' };

  let overExerciseId: string | null = null;
  let targetBlockId: string | null = null;
  if (overId.startsWith(CONTAINER_DND_PREFIX)) targetBlockId = overId.slice(2);
  else if (overId.startsWith(EXERCISE_DND_PREFIX)) {
    overExerciseId = overId.slice(2);
    targetBlockId = findBlockByExercise(blocks, overExerciseId)?.id ?? null;
  }

  const target = targetBlockId ? findBlock(blocks, targetBlockId) : null;
  if (!target || !isGroupBlock(target)) return { type: 'none' };

  if (target.id !== source.id)
    return { type: 'moveExercise', sourceBlockId: source.id, itemId, targetBlockId: target.id };

  const itemIds = source.exercises.map((exercise) => exercise.id);
  const from = itemIds.indexOf(itemId);
  const to = overExerciseId ? itemIds.indexOf(overExerciseId) : itemIds.length - 1;
  if (from === -1 || to === -1 || from === to) return { type: 'none' };
  return { type: 'reorderExercises', blockId: source.id, itemIds: arrayMove(itemIds, from, to) };
};

/**
 * Pure resolution of a completed drag into a single mutation intent. Blocks
 * reorder among themselves; a single may hand its exercise to a group; grouped
 * exercises reorder within their group or move to another group.
 */
export const resolveDragEnd = (blocks: ProgramDayBlock[], activeId: string, overId: string | null): DragEndAction => {
  if (!overId || activeId === overId) return { type: 'none' };
  if (activeId.startsWith(BLOCK_DND_PREFIX)) return resolveBlockDragEnd(blocks, activeId, overId);
  if (activeId.startsWith(EXERCISE_DND_PREFIX)) return resolveExerciseDragEnd(blocks, activeId, overId);
  return { type: 'none' };
};
