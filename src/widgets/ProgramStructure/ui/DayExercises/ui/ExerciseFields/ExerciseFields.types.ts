import type { ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

export type ExerciseFieldsProps = {
  exercise: ProgramDayExercise;
  canEdit: boolean;
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
  className?: string;
};
