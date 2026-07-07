import type { ReactNode } from 'react';

import type { ProgramDayBlock, ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

import type { BlockMoveTarget } from '../../DayExercises.types';

export type GroupExerciseRowProps = {
  /** The group block this exercise belongs to. */
  block: ProgramDayBlock;
  exercise: ProgramDayExercise;
  exerciseName: string;
  canEdit: boolean;
  /** Drag activator when editable, otherwise a spacer that preserves the column. */
  dragHandle: ReactNode;
  /** Other group blocks in the day this exercise can be moved into. */
  moveTargets: BlockMoveTarget[];
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
  onRequestDelete: (blockId: string, itemId: string) => void;
  onExtract: (blockId: string, itemId: string) => void;
  onMoveToBlock: (blockId: string, itemId: string, targetBlockId: string) => void;
};
