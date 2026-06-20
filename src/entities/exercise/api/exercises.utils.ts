import type { ExerciseSortField, FetchExercisesListParams } from './exercises.types';

const SORT_FIELD_TO_QUERY: Record<ExerciseSortField, string> = {
  name: 'name',
  type: 'type',
  muscleGroup: 'muscle_group',
  difficulty: 'difficulty',
  modifiedAt: 'modified_at',
};

/**
 * Translates FE list params (camelCase) into the snake_case query the backend expects.
 * Filters are array-shaped to stay multi-select ready; today the UI sends at most one value each.
 */
export const buildExercisesQuery = (params: FetchExercisesListParams): Record<string, string | string[]> => {
  const query: Record<string, string | string[]> = {};

  if (params.name) query.q = params.name;
  if (params.type?.length) query.type = [...params.type];
  if (params.muscleGroup?.length) query.muscle_group = [...params.muscleGroup];
  if (params.equipment?.length) query.equipment = [...params.equipment];
  if (params.difficulty?.length) query.difficulty = [...params.difficulty];
  if (params.sortBy) {
    query.sort_by = SORT_FIELD_TO_QUERY[params.sortBy];
    query.sort_order = params.sortOrder ?? 'asc';
  }

  return query;
};
