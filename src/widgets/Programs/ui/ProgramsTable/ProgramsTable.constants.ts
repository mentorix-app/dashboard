import type { ProgramSortField } from '@/src/entities/program';

export const SKELETON_ROW_COUNT = 5;
export const NEXT_PAGE_SKELETON_ROW_COUNT = 3;

export type ProgramColumn =
  | 'name'
  | 'status'
  | 'category'
  | 'difficulty'
  | 'exercisesCount'
  | 'weeksCount'
  | 'createdBy'
  | 'enrolledUsers'
  | 'modifiedAt';

export const TABLE_COLUMNS: readonly ProgramColumn[] = [
  'name',
  'status',
  'category',
  'difficulty',
  'exercisesCount',
  'weeksCount',
  'createdBy',
  'enrolledUsers',
  'modifiedAt',
];

export const SORTABLE_COLUMNS: readonly ProgramSortField[] = ['name', 'status', 'category', 'difficulty', 'modifiedAt'];

export const TABLE_COLUMN_COUNT = TABLE_COLUMNS.length;
