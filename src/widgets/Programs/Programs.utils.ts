import type { FetchProgramsListParams, ProgramSortOrder } from '@/src/entities/program';

import {
  PROGRAM_CATEGORY_OPTIONS,
  PROGRAM_DIFFICULTY_OPTIONS,
  PROGRAM_SORT_FIELDS,
  PROGRAM_STATUS_OPTIONS,
} from './Programs.constants';
import type { ProgramsSearchParamUpdates } from './Programs.types';

type SearchParamsReader = {
  get: (name: string) => string | null;
};

const SORT_ORDERS: readonly ProgramSortOrder[] = ['asc', 'desc'];

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

export const parseProgramsSearchParams = (searchParams: SearchParamsReader): FetchProgramsListParams => ({
  name: searchParams.get('name')?.trim() || undefined,
  status: getValidValues(PROGRAM_STATUS_OPTIONS, getDelimitedValues(searchParams, 'status')),
  category: getValidValues(PROGRAM_CATEGORY_OPTIONS, getDelimitedValues(searchParams, 'category')),
  difficulty: getValidValues(PROGRAM_DIFFICULTY_OPTIONS, getDelimitedValues(searchParams, 'difficulty')),
  sortBy: getValidValue(PROGRAM_SORT_FIELDS, searchParams.get('sortBy')),
  sortOrder: getValidValue(SORT_ORDERS, searchParams.get('sortOrder')),
});

export const createProgramsSearchParams = (
  currentSearchParams: string,
  updates: ProgramsSearchParamUpdates
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);

  if ('name' in updates) setOptionalParam(params, 'name', updates.name?.trim() || undefined);
  if ('status' in updates) setArrayParam(params, 'status', updates.status);
  if ('category' in updates) setArrayParam(params, 'category', updates.category);
  if ('difficulty' in updates) setArrayParam(params, 'difficulty', updates.difficulty);
  if ('sortBy' in updates) setOptionalParam(params, 'sortBy', updates.sortBy);
  if ('sortOrder' in updates) setOptionalParam(params, 'sortOrder', updates.sortOrder);

  if (!params.get('sortBy')) params.delete('sortOrder');
  if (params.get('sortBy') && !params.get('sortOrder')) params.set('sortOrder', 'asc');

  return params;
};
