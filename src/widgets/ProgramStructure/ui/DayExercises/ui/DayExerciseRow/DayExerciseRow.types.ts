import type { ReactNode } from 'react';

import type { ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

import type { MoveTargetDay } from '../../DayExercises.types';

export type DayExerciseRowProps = {
  exercise: ProgramDayExercise;
  exerciseName: string;
  canEdit: boolean;
  /** Drag activator when editable, otherwise a spacer that preserves the column. */
  dragHandle: ReactNode;
  /** Other days in the week this exercise can be moved to. */
  moveTargets: MoveTargetDay[];
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
  onDelete: (itemId: string) => void;
  onMove: (itemId: string, toDayId: string) => void;
};
