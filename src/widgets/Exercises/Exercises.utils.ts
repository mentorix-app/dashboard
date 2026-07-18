import type { ExerciseSortOrder, FetchExercisesListParams } from '@/src/entities/exercise';

import {
  EXERCISE_DIFFICULTY_OPTIONS,
  EXERCISE_EQUIPMENT_OPTIONS,
  EXERCISE_MUSCLE_GROUP_OPTIONS,
  EXERCISE_SCOPE_OPTIONS,
  EXERCISE_SORT_FIELDS,
  EXERCISE_TYPE_OPTIONS,
} from './Exercises.constants';
import type { ExercisesSearchParamUpdates } from './Exercises.types';

type SearchParamsReader = {
  get: (name: string) => string | null;
};

const SORT_ORDERS: readonly ExerciseSortOrder[] = ['asc', 'desc'];

const getValidValues = <T extends string>(values: readonly T[], selected: string[]): T[] => {
  const allowed = new Set<string>(values);

  return selected.filter((value): value is T => allowed.has(value));
};

const getDelimitedValues = (searchParams: SearchParamsReader, key: string): string[] =>
  searchParams
    .get(key)
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean) ?? [];

const getValidValue = <T extends string>(values: readonly T[], selected: string | null): T | undefined => {
  if (!selected) return undefined;

  return values.find((value) => value === selected);
};

const setArrayParam = <T extends string>(params: URLSearchParams, key: string, values: readonly T[] | undefined) => {
  if (values?.length) {
    params.set(key, values.join(','));
    return;
  }

  params.delete(key);
};

const setOptionalParam = (params: URLSearchParams, key: string, value: string | undefined) => {
  if (value) {
    params.set(key, value);
    return;
  }

  params.delete(key);
};

export const parseExercisesSearchParams = (searchParams: SearchParamsReader): FetchExercisesListParams => ({
  name: searchParams.get('name')?.trim() || undefined,
  type: getValidValues(EXERCISE_TYPE_OPTIONS, getDelimitedValues(searchParams, 'type')),
  muscleGroup: getValidValues(EXERCISE_MUSCLE_GROUP_OPTIONS, getDelimitedValues(searchParams, 'muscleGroup')),
  equipment: getValidValues(EXERCISE_EQUIPMENT_OPTIONS, getDelimitedValues(searchParams, 'equipment')),
  difficulty: getValidValues(EXERCISE_DIFFICULTY_OPTIONS, getDelimitedValues(searchParams, 'difficulty')),
  scope: getValidValue(EXERCISE_SCOPE_OPTIONS, searchParams.get('scope')),
  sortBy: getValidValue(EXERCISE_SORT_FIELDS, searchParams.get('sortBy')),
  sortOrder: getValidValue(SORT_ORDERS, searchParams.get('sortOrder')),
});

export const createExercisesSearchParams = (
  currentSearchParams: string,
  updates: ExercisesSearchParamUpdates
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);

  if ('name' in updates) setOptionalParam(params, 'name', updates.name?.trim() || undefined);
  if ('type' in updates) setArrayParam(params, 'type', updates.type);
  if ('muscleGroup' in updates) setArrayParam(params, 'muscleGroup', updates.muscleGroup);
  if ('equipment' in updates) setArrayParam(params, 'equipment', updates.equipment);
  if ('difficulty' in updates) setArrayParam(params, 'difficulty', updates.difficulty);
  if ('scope' in updates) setOptionalParam(params, 'scope', updates.scope);
  if ('sortBy' in updates) setOptionalParam(params, 'sortBy', updates.sortBy);
  if ('sortOrder' in updates) setOptionalParam(params, 'sortOrder', updates.sortOrder);

  if (!params.get('sortBy')) params.delete('sortOrder');
  if (params.get('sortBy') && !params.get('sortOrder')) params.set('sortOrder', 'asc');

  return params;
};
