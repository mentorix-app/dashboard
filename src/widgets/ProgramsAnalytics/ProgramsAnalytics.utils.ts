import type {
  AnalyticsProgramStatus,
  ProgramAnalyticsSortField,
  ProgramAnalyticsSortOrder,
} from '@/src/entities/analytics';
import { ProgramStatus } from '@/src/entities/program/model/types';

import type { ProgramsAnalyticsListState, ProgramsAnalyticsSearchParamUpdates } from './ProgramsAnalytics.types';

type SearchParamsReader = {
  get: (name: string) => string | null;
};

const SORT_FIELDS: readonly ProgramAnalyticsSortField[] = ['name', 'lastActivity'];
const SORT_ORDERS: readonly ProgramAnalyticsSortOrder[] = ['asc', 'desc'];

/** Analytics list-endpoint statuses map 1:1 to the program status enum. */
const STATUS_TO_ENUM: Record<AnalyticsProgramStatus, ProgramStatus> = {
  draft: ProgramStatus.Draft,
  published: ProgramStatus.Published,
  archived: ProgramStatus.Archived,
};

const getValidValue = <T extends string>(values: readonly T[], selected: string | null, fallback: T): T =>
  values.find((value) => value === selected) ?? fallback;

/** Drafts have no active clients, so only published/archived open a detail page. */
export const isAnalyticsDetailAvailable = (status: AnalyticsProgramStatus): boolean => status !== 'draft';

export const toProgramStatusEnum = (status: AnalyticsProgramStatus): ProgramStatus => STATUS_TO_ENUM[status];

export const parseProgramsAnalyticsSearchParams = (searchParams: SearchParamsReader): ProgramsAnalyticsListState => ({
  name: searchParams.get('q')?.trim() || undefined,
  sortBy: getValidValue(SORT_FIELDS, searchParams.get('sort'), 'lastActivity'),
  sortOrder: getValidValue(SORT_ORDERS, searchParams.get('order'), 'desc'),
});

export const createProgramsAnalyticsSearchParams = (
  currentSearchParams: string,
  updates: ProgramsAnalyticsSearchParamUpdates
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);

  if ('name' in updates) {
    const name = updates.name?.trim();
    if (name) params.set('q', name);
    else params.delete('q');
  }
  if ('sortBy' in updates && updates.sortBy) params.set('sort', updates.sortBy);
  if ('sortOrder' in updates && updates.sortOrder) params.set('order', updates.sortOrder);

  return params;
};
