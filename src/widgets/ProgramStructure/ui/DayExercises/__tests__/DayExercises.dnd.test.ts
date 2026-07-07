import { renderHook } from '@testing-library/react';
import type { DragEndEvent } from '@dnd-kit/core';

import {
  ProgramBlockType,
  type ProgramDayBlock,
  type ProgramDayExercise,
} from '@/src/entities/program/model/structure';

import { useDayDnd } from '../hooks';

const buildExercise = (id: string, sortOrder: number): ProgramDayExercise => ({
  id,
  exerciseId: `${id}-def`,
  exerciseName: id,
  exerciseNameRu: id,
  sortOrder,
  sets: 3,
  reps: 10,
  instruction: '',
  createdAt: '2024-01-01T00:00:00Z',
});

const buildBlock = (
  id: string,
  blockType: ProgramBlockType,
  sortOrder: number,
  exerciseIds: string[]
): ProgramDayBlock => ({
  id,
  blockType,
  instruction: '',
  sortOrder,
  exercises: exerciseIds.map((exerciseId, index) => buildExercise(exerciseId, index + 1)),
  createdAt: '2024-01-01T00:00:00Z',
});

// blk-a: single (exa1) · blk-b: group (exb1, exb2, exb3) · blk-c: group (exc1)
const buildBlocks = (): ProgramDayBlock[] => [
  buildBlock('blk-a', ProgramBlockType.Single, 1, ['exa1']),
  buildBlock('blk-b', ProgramBlockType.Complex, 2, ['exb1', 'exb2', 'exb3']),
  buildBlock('blk-c', ProgramBlockType.Superset, 3, ['exc1']),
];

const dragEnd = (activeId: string, overId: string | null): DragEndEvent =>
  ({ active: { id: activeId }, over: overId === null ? null : { id: overId } }) as unknown as DragEndEvent;

const setup = () => {
  const onReorderBlocks = jest.fn();
  const onReorderBlockExercises = jest.fn();
  const onMoveExerciseToBlock = jest.fn();
  const onExtractExercise = jest.fn();
  const { result } = renderHook(() =>
    useDayDnd({
      blocks: buildBlocks(),
      onReorderBlocks,
      onReorderBlockExercises,
      onMoveExerciseToBlock,
      onExtractExercise,
    })
  );
  return { result, onReorderBlocks, onReorderBlockExercises, onMoveExerciseToBlock, onExtractExercise };
};

describe('useDayDnd handleDragEnd', () => {
  it('reorders blocks when a block is dropped over another block', () => {
    const { result, onReorderBlocks, onReorderBlockExercises, onMoveExerciseToBlock } = setup();

    result.current.handleDragEnd(dragEnd('B:blk-a', 'B:blk-c'));

    expect(onReorderBlocks).toHaveBeenCalledWith(['blk-b', 'blk-c', 'blk-a']);
    expect(onReorderBlockExercises).not.toHaveBeenCalled();
    expect(onMoveExerciseToBlock).not.toHaveBeenCalled();
  });

  it('reorders exercises within a group when dropped over a sibling', () => {
    const { result, onReorderBlockExercises, onMoveExerciseToBlock } = setup();

    result.current.handleDragEnd(dragEnd('E:exb1', 'E:exb3'));

    expect(onReorderBlockExercises).toHaveBeenCalledWith('blk-b', ['exb2', 'exb3', 'exb1']);
    expect(onMoveExerciseToBlock).not.toHaveBeenCalled();
  });

  it('reorders an exercise to the end when dropped over its own container', () => {
    const { result, onReorderBlockExercises } = setup();

    result.current.handleDragEnd(dragEnd('E:exb1', 'C:blk-b'));

    expect(onReorderBlockExercises).toHaveBeenCalledWith('blk-b', ['exb2', 'exb3', 'exb1']);
  });

  it('moves an exercise to another group at the hovered slot when dropped over a foreign exercise', () => {
    const { result, onMoveExerciseToBlock, onReorderBlockExercises } = setup();

    result.current.handleDragEnd(dragEnd('E:exb1', 'E:exc1'));

    expect(onMoveExerciseToBlock).toHaveBeenCalledWith('blk-b', 'exb1', 'blk-c', ['exb1', 'exc1']);
    expect(onReorderBlockExercises).not.toHaveBeenCalled();
  });

  it('moves an exercise to the end of another group when dropped over its container', () => {
    const { result, onMoveExerciseToBlock } = setup();

    result.current.handleDragEnd(dragEnd('E:exb1', 'C:blk-c'));

    expect(onMoveExerciseToBlock).toHaveBeenCalledWith('blk-b', 'exb1', 'blk-c', ['exc1', 'exb1']);
  });

  it('ignores a drop with no target', () => {
    const { result, onReorderBlocks, onReorderBlockExercises, onMoveExerciseToBlock } = setup();

    result.current.handleDragEnd(dragEnd('B:blk-a', null));

    expect(onReorderBlocks).not.toHaveBeenCalled();
    expect(onReorderBlockExercises).not.toHaveBeenCalled();
    expect(onMoveExerciseToBlock).not.toHaveBeenCalled();
  });

  it('ignores a drop onto itself', () => {
    const { result, onReorderBlocks } = setup();

    result.current.handleDragEnd(dragEnd('B:blk-a', 'B:blk-a'));

    expect(onReorderBlocks).not.toHaveBeenCalled();
  });

  it('moves a single exercise into a group at the hovered slot when dropped over a group exercise', () => {
    const { result, onMoveExerciseToBlock, onReorderBlocks } = setup();

    result.current.handleDragEnd(dragEnd('B:blk-a', 'E:exb1'));

    expect(onMoveExerciseToBlock).toHaveBeenCalledWith('blk-a', 'exa1', 'blk-b', ['exa1', 'exb1', 'exb2', 'exb3']);
    expect(onReorderBlocks).not.toHaveBeenCalled();
  });

  it('moves a single exercise to the end of a group when dropped over its container', () => {
    const { result, onMoveExerciseToBlock } = setup();

    result.current.handleDragEnd(dragEnd('B:blk-a', 'C:blk-c'));

    expect(onMoveExerciseToBlock).toHaveBeenCalledWith('blk-a', 'exa1', 'blk-c', ['exc1', 'exa1']);
  });

  it('keeps a group block on the block plane: dropped over an exercise it does nothing', () => {
    const { result, onReorderBlocks, onReorderBlockExercises, onMoveExerciseToBlock } = setup();

    result.current.handleDragEnd(dragEnd('B:blk-b', 'E:exc1'));

    expect(onReorderBlocks).not.toHaveBeenCalled();
    expect(onReorderBlockExercises).not.toHaveBeenCalled();
    expect(onMoveExerciseToBlock).not.toHaveBeenCalled();
  });

  it('extracts a grouped exercise into a new single block when dropped onto the block plane', () => {
    const { result, onExtractExercise, onMoveExerciseToBlock, onReorderBlockExercises } = setup();

    result.current.handleDragEnd(dragEnd('E:exb1', 'B:blk-a'));

    expect(onExtractExercise).toHaveBeenCalledWith('blk-b', 'exb1', 0);
    expect(onMoveExerciseToBlock).not.toHaveBeenCalled();
    expect(onReorderBlockExercises).not.toHaveBeenCalled();
  });
});
