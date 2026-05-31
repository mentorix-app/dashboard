import type {
  Exercise,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseMuscleGroup,
  ExerciseType,
} from '../model/types';

export type ExerciseSortField = 'name' | 'type' | 'muscleGroup' | 'equipment' | 'difficulty' | 'modifiedAt';

export type ExerciseSortOrder = 'asc' | 'desc';

export type FetchExercisesParams = {
  name?: string;
  type?: ExerciseType[];
  muscleGroup?: ExerciseMuscleGroup[];
  equipment?: ExerciseEquipment[];
  difficulty?: ExerciseDifficulty[];
  sortBy?: ExerciseSortField;
  sortOrder?: ExerciseSortOrder;
  limit?: number;
  cursor?: number;
};

export type FetchExercisesListParams = Omit<FetchExercisesParams, 'limit' | 'cursor'>;

export type FetchExercisesResponse = {
  items: Exercise[];
  nextCursor: number | null;
  total: number;
};

export type DeleteExercisesParams = {
  ids: string[];
};

export type DeleteExercisesResponse = {
  deletedIds: string[];
};

export type CreateExerciseParams = Omit<Exercise, 'id' | 'addedBy' | 'modifiedBy' | 'modifiedAt'>;

export type CreateExerciseResponse = Exercise;
