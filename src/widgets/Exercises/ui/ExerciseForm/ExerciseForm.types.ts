import type { ExerciseDifficulty, ExerciseEquipment, ExerciseMuscleGroup, ExerciseType } from '@/src/entities/exercise';

export type ExerciseFormValues = {
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  type: ExerciseType | '';
  muscleGroup: ExerciseMuscleGroup | '';
  equipment: ExerciseEquipment | '';
  difficulty: ExerciseDifficulty | '';
  videoUrl: string;
  previewImageUrl: string;
};

export type ExerciseFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
