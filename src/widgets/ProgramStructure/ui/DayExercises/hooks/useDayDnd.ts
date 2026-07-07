'use client';

import { useMemo, useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import type { ProgramDayBlock, ProgramDayExercise } from '@/src/entities/program/model/structure';

import type { SingleImportPreview } from '../context';
import {
  BLOCK_DND_PREFIX,
  EXERCISE_DND_PREFIX,
  applyDragOver,
  buildCollisionDetection,
  buildGroupLanes,
  findBlock,
  groupTargetId,
  isGroupBlock,
  resolveDragEnd,
  type GroupLanes,
} from '../lib';

type UseDayDndParams = {
  blocks: ProgramDayBlock[];
  onReorderBlocks: (blockIds: string[]) => void;
  onReorderBlockExercises: (blockId: string, exerciseItemIds: string[]) => void;
  onMoveExerciseToBlock: (blockId: string, itemId: string, targetBlockId: string) => void;
};

/**
 * Drag-and-drop orchestration for one day. A single DndContext spans two planes:
 * blocks (reordered among themselves, and a single dropped into a group) and
 * grouped exercises (reordered within a group or moved to another). Local lane
 * state drives only the cross-group gap preview; the drop is resolved from the
 * server tree and the mutation response re-renders the final order.
 */
export const useDayDnd = ({
  blocks,
  onReorderBlocks,
  onReorderBlockExercises,
  onMoveExerciseToBlock,
}: UseDayDndParams) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [singleImportExerciseId, setSingleImportExerciseId] = useState<string | null>(null);
  const [singleImportTargetId, setSingleImportTargetId] = useState<string | null>(null);
  const [lanes, setLanes] = useState<GroupLanes | null>(null);

  const collisionDetection = useMemo(() => buildCollisionDetection(blocks), [blocks]);
  const exerciseById = useMemo(() => {
    const map = new Map<string, ProgramDayExercise>();
    for (const block of blocks) for (const exercise of block.exercises) map.set(exercise.id, exercise);
    return map;
  }, [blocks]);

  const reset = () => {
    setActiveExerciseId(null);
    setSingleImportExerciseId(null);
    setSingleImportTargetId(null);
    setLanes(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (id.startsWith(EXERCISE_DND_PREFIX)) {
      setActiveExerciseId(id.slice(2));
      setLanes(buildGroupLanes(blocks));
      return;
    }
    const block = id.startsWith(BLOCK_DND_PREFIX) ? findBlock(blocks, id.slice(2)) : undefined;
    const exercise = block && !isGroupBlock(block) ? block.exercises[0] : undefined;
    if (exercise) setSingleImportExerciseId(exercise.id);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const overId = String(over.id);
    if (singleImportExerciseId) {
      const target = groupTargetId(blocks, overId);
      setSingleImportTargetId((current) => (current === target ? current : target));
      return;
    }
    setLanes((current) => (current ? applyDragOver(current, String(active.id), overId) : current));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    reset();
    const action = resolveDragEnd(blocks, String(event.active.id), event.over ? String(event.over.id) : null);
    if (action.type === 'reorderBlocks') onReorderBlocks(action.blockIds);
    else if (action.type === 'reorderExercises') onReorderBlockExercises(action.blockId, action.itemIds);
    else if (action.type === 'moveExercise')
      onMoveExerciseToBlock(action.sourceBlockId, action.itemId, action.targetBlockId);
  };

  const getBlockExercises = (block: ProgramDayBlock): ProgramDayExercise[] => {
    const laneIds = lanes?.[block.id];
    if (!laneIds) return block.exercises;
    return laneIds
      .map((id) => exerciseById.get(id))
      .filter((exercise): exercise is ProgramDayExercise => Boolean(exercise));
  };

  const singleImportExercise = singleImportExerciseId ? exerciseById.get(singleImportExerciseId) : undefined;
  const singleImport: SingleImportPreview | null =
    singleImportTargetId && singleImportExercise
      ? { blockId: singleImportTargetId, exercise: singleImportExercise }
      : null;

  return {
    sensors,
    collisionDetection,
    activeExercise: activeExerciseId ? (exerciseById.get(activeExerciseId) ?? null) : null,
    singleImport,
    getBlockExercises,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel: reset,
  };
};
