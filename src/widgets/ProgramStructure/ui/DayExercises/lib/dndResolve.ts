import { arrayMove } from '@dnd-kit/sortable';

import { ProgramBlockType, type ProgramDayBlock } from '@/src/entities/program/model/structure';

import {
  BLOCK_DND_PREFIX,
  CONTAINER_DND_PREFIX,
  EXERCISE_DND_PREFIX,
  findBlock,
  findBlockByExercise,
  groupInsertIndex,
  groupTargetId,
  insertExerciseAt,
  isGroupBlock,
} from './dndLanes';

export type DragEndAction =
  | { type: 'reorderBlocks'; blockIds: string[] }
  | { type: 'reorderExercises'; blockId: string; itemIds: string[] }
  | {
      type: 'moveExercise';
      sourceBlockId: string;
      itemId: string;
      targetBlockId: string;
      targetItemIds: string[];
    }
  | { type: 'extractExercise'; sourceBlockId: string; itemId: string; sortOrder: number }
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

  // A single dropped onto a group hands its lone exercise over at the hovered slot.
  if (active.blockType !== ProgramBlockType.Single) return { type: 'none' };
  const exercise = active.exercises[0];
  const targetBlockId = groupTargetId(blocks, overId);
  const target = targetBlockId ? findBlock(blocks, targetBlockId) : null;
  if (!exercise || !target || target.id === active.id) return { type: 'none' };
  const targetItemIds = insertExerciseAt(target, exercise.id, groupInsertIndex(blocks, target.id, overId));
  return {
    type: 'moveExercise',
    sourceBlockId: active.id,
    itemId: exercise.id,
    targetBlockId: target.id,
    targetItemIds,
  };
};

const resolveExerciseDragEnd = (blocks: ProgramDayBlock[], activeId: string, overId: string): DragEndAction => {
  const itemId = activeId.slice(2);
  const source = findBlockByExercise(blocks, itemId);
  if (!source) return { type: 'none' };

  // Dropped onto the block plane: pull the exercise out into a new single block
  // taking the hovered block's slot among the day's blocks.
  if (overId.startsWith(BLOCK_DND_PREFIX)) {
    if (!isGroupBlock(source)) return { type: 'none' };
    const sortOrder = blocks.findIndex((block) => block.id === overId.slice(2));
    if (sortOrder === -1) return { type: 'none' };
    return { type: 'extractExercise', sourceBlockId: source.id, itemId, sortOrder };
  }

  let overExerciseId: string | null = null;
  let targetBlockId: string | null = null;
  if (overId.startsWith(CONTAINER_DND_PREFIX)) targetBlockId = overId.slice(2);
  else if (overId.startsWith(EXERCISE_DND_PREFIX)) {
    overExerciseId = overId.slice(2);
    targetBlockId = findBlockByExercise(blocks, overExerciseId)?.id ?? null;
  }

  const target = targetBlockId ? findBlock(blocks, targetBlockId) : null;
  if (!target || !isGroupBlock(target)) return { type: 'none' };

  if (target.id !== source.id) {
    const targetItemIds = insertExerciseAt(target, itemId, groupInsertIndex(blocks, target.id, overId));
    return { type: 'moveExercise', sourceBlockId: source.id, itemId, targetBlockId: target.id, targetItemIds };
  }

  const itemIds = source.exercises.map((exercise) => exercise.id);
  const from = itemIds.indexOf(itemId);
  const to = overExerciseId ? itemIds.indexOf(overExerciseId) : itemIds.length - 1;
  if (from === -1 || to === -1 || from === to) return { type: 'none' };
  return { type: 'reorderExercises', blockId: source.id, itemIds: arrayMove(itemIds, from, to) };
};

/**
 * Pure resolution of a completed drag into a single mutation intent. Blocks
 * reorder among themselves; a single may hand its exercise to a group at a chosen
 * slot; grouped exercises reorder within their group, move to another group at a
 * chosen slot, or extract onto the block plane as a new single block.
 */
export const resolveDragEnd = (blocks: ProgramDayBlock[], activeId: string, overId: string | null): DragEndAction => {
  if (!overId || activeId === overId) return { type: 'none' };
  if (activeId.startsWith(BLOCK_DND_PREFIX)) return resolveBlockDragEnd(blocks, activeId, overId);
  if (activeId.startsWith(EXERCISE_DND_PREFIX)) return resolveExerciseDragEnd(blocks, activeId, overId);
  return { type: 'none' };
};
