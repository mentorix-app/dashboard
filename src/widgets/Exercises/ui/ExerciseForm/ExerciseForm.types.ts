import type { ExerciseEquipment, ExerciseMuscleGroup, ExerciseType } from '@/src/entities/exercise';
import type { Difficulty } from '@/src/shared/types';

export type ExerciseFormValues = {
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  type: ExerciseType | '';
  muscleGroup: ExerciseMuscleGroup | '';
  equipment: ExerciseEquipment | '';
  difficulty: Difficulty | '';
  videoUrl: string;
  previewImageUrl: string;
};

export type ExerciseFormProps = {
  open: boolean;
  exerciseId?: string;
  readOnly?: boolean;
  onOpenChange: (open: boolean) => void;
};
