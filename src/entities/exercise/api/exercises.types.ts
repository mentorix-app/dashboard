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
  deletedCount: number;
};

export type CreateExerciseParams = Omit<Exercise, 'id' | 'addedBy' | 'modifiedBy' | 'modifiedAt' | 'createdAt'>;

export type CreateExerciseResponse = Exercise;

export type UpdateExerciseParams = CreateExerciseParams;

export type UpdateExerciseVariables = {
  id: string;
  params: UpdateExerciseParams;
};

export type UpdateExerciseResponse = Exercise;
