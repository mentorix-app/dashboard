import type { ExerciseSortField } from '@/src/entities/exercise';

export const SKELETON_ROW_COUNT = 5;
export const NEXT_PAGE_SKELETON_ROW_COUNT = 3;
export const TABLE_COLUMN_COUNT = 7;

export type ExerciseColumn = ExerciseSortField | 'equipment';

export const TABLE_COLUMNS: readonly ExerciseColumn[] = [
  'name',
  'type',
  'muscleGroup',
  'equipment',
  'difficulty',
  'modifiedAt',
];

export const SORTABLE_COLUMNS: readonly ExerciseSortField[] = [
  'name',
  'type',
  'muscleGroup',
  'difficulty',
  'modifiedAt',
];
