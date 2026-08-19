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

export const parseWeekParam = (searchParams: SearchParamsReader, rawWeekNumbers: number[]): number => {
  const week = Number(searchParams.get('week'));
  return rawWeekNumbers.includes(week) ? week : (rawWeekNumbers.at(-1) ?? 0);
};

export const parseDayParam = (searchParams: SearchParamsReader): number | null => {
  const raw = searchParams.get('day');
  if (raw === null) return null;
  const day = Number(raw);
  return Number.isInteger(day) && day > 0 ? day : null;
};

/** Keep selectors stable without changing which raw API item is the fallback. */
export const getSortedUniqueNumbers = (values: number[]): number[] =>
  [...new Set(values)].sort((first, second) => first - second);

/** Clamp the URL day to a valid training day, defaulting to the final raw API item. */
export const resolveSelectedDay = (rawDayNumbers: number[], selected: number | null): number =>
  selected !== null && rawDayNumbers.includes(selected) ? selected : (rawDayNumbers.at(-1) ?? 0);

export const createWeekResultsParams = (
  currentSearchParams: string,
  updates: WeekResultsParamUpdates
): URLSearchParams => {
  const params = new URLSearchParams(currentSearchParams);

  if (updates.week !== undefined) params.set('week', String(updates.week));
  if (updates.view !== undefined) params.set('view', updates.view);
  if (updates.day === null) params.delete('day');
  else if (updates.day !== undefined) params.set('day', String(updates.day));

  return params;
};
