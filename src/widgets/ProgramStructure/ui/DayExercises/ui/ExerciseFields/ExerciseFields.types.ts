import type { ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

export type ExerciseFieldsProps = {
  exercise: ProgramDayExercise;
  exerciseName: string;
  canEdit: boolean;
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
};
