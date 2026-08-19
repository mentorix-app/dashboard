import type { ReactNode } from 'react';

import type { ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

export type ExerciseFieldsProps = {
  exercise: ProgramDayExercise;
  exerciseName: string;
  indicator?: ReactNode;
  action?: ReactNode;
  canEdit: boolean;
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
  className?: string;
};
