import type { ReactNode } from 'react';

import type { ProgramDayBlock, ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

import type { MoveTargetDay } from '../../DayExercises.types';

export type SingleBlockRowProps = {
  /** The `single` block that wraps this exercise (moves/deletes target the block). */
  block: ProgramDayBlock;
  exercise: ProgramDayExercise;
  exerciseName: string;
  canEdit: boolean;
  /** Whether this block is currently picked for a merge. */
  selected: boolean;
  /** Drag activator when editable, otherwise a spacer that preserves the column. */
  dragHandle: ReactNode;
  /** Other days in the week this exercise's block can be moved to. */
  moveTargets: MoveTargetDay[];
  onSelectChange: (blockId: string, checked: boolean) => void;
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
  onRequestDelete: (blockId: string, itemId: string) => void;
  onMoveToDay: (blockId: string, toDayId: string) => void;
};
