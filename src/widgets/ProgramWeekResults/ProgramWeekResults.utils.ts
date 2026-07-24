import type { ViewMode } from '@/src/features/ViewModeSwitch';

import type { WeekResultsCellVM, WeekResultsParamUpdates } from './ProgramWeekResults.types';

/** A submitted day with no reply yet: the trainer can still leave one reply. */
export const canReplyToCell = (cell: WeekResultsCellVM): boolean =>
  cell.isSubmitted && cell.completionId !== null && cell.comments.length === 0;

type SearchParamsReader = {
  get: (name: string) => string | null;
};

/** `grid` renders per-day cards; `list` renders the week matrix table. */
export const WEEK_RESULTS_VIEWS: readonly ViewMode[] = ['grid', 'list'];

const getValidValue = <T extends string>(values: readonly T[], selected: string | null, fallback: T): T =>
  values.find((value) => value === selected) ?? fallback;

export const parseWeekResultsView = (searchParams: SearchParamsReader): ViewMode =>
  getValidValue(WEEK_RESULTS_VIEWS, searchParams.get('view'), 'grid');

export const parseWeekParam = (
  searchParams: SearchParamsReader,
  availableWeeks: number[],
  fallback: number
): number => {
  const week = Number(searchParams.get('week'));
  return availableWeeks.includes(week) ? week : fallback;
};

export const parseDayParam = (searchParams: SearchParamsReader): number | null => {
  const raw = searchParams.get('day');
  if (raw === null) return null;
  const day = Number(raw);
  return Number.isInteger(day) && day > 0 ? day : null;
};

/** Clamp the URL day to a valid training day, defaulting to the first. */
export const resolveSelectedDay = (dayNumbers: number[], selected: number | null): number =>
  selected !== null && dayNumbers.includes(selected) ? selected : (dayNumbers[0] ?? 0);

export const createWeekResultsParams = (
  currentSearchParams: string,
  updates: WeekResultsParamUpdates
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);

  if (updates.week !== undefined) params.set('week', String(updates.week));
  if (updates.view !== undefined) params.set('view', updates.view);
  if (updates.day !== undefined) params.set('day', String(updates.day));

  return params;
};
