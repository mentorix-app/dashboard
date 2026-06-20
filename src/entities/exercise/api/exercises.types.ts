import type {
  Exercise,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseMuscleGroup,
  ExerciseType,
} from '../model/types';

export type ExerciseSortField = 'name' | 'type' | 'muscleGroup' | 'difficulty' | 'modifiedAt';

export type ExerciseSortOrder = 'asc' | 'desc';

export type FetchExercisesParams = {
  name?: string;
  type?: ExerciseType[];
  muscleGroup?: ExerciseMuscleGroup[];
  equipment?: ExerciseEquipment[];
  difficulty?: ExerciseDifficulty[];
  sortBy?: ExerciseSortField;
  sortOrder?: ExerciseSortOrder;
};

export type FetchExercisesListParams = FetchExercisesParams;

export type ExercisesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ExercisesListResult = {
  items: Exercise[];
  pagination: ExercisesPagination;
};

export type DeleteExercisesParams = {
  ids: string[];
};

export type DeleteExercisesResponse = {
  deletedIds: string[];
};

export type CreateExerciseParams = Omit<Exercise, 'id' | 'addedBy' | 'modifiedBy' | 'modifiedAt'>;

export type CreateExerciseResponse = Exercise;
