'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import type { ViewMode } from '@/src/features/ViewModeSwitch';

import type { WeekResultsParamUpdates } from '../ProgramWeekResults.types';
import {
  createWeekResultsParams,
  parseDayParam,
  parseWeekParam,
  parseWeekResultsView,
} from '../ProgramWeekResults.utils';

type WeekResultsState = {
  week: number;
  view: ViewMode;
  day: number | null;
  setWeek: (week: number) => void;
  setView: (view: ViewMode) => void;
  setDay: (day: number) => void;
};

/** Persists week / view / day selections in the URL query string. */
export const useWeekResultsState = (rawWeekNumbers: number[]): WeekResultsState => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const week = parseWeekParam(searchParams, rawWeekNumbers);
  const view = parseWeekResultsView(searchParams);
  const day = parseDayParam(searchParams);

  const update = useCallback(
    (updates: WeekResultsParamUpdates) => {
      const next = createWeekResultsParams(searchParamsKey, updates);
      const query = next.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.pushState(null, '', nextUrl);
    },
    [searchParamsKey]
  );

  const setWeek = useCallback((next: number) => update({ week: next, day: null }), [update]);
  const setView = useCallback((next: ViewMode) => update({ view: next }), [update]);
  const setDay = useCallback((next: number) => update({ day: next }), [update]);

  return useMemo(() => ({ week, view, day, setWeek, setView, setDay }), [week, view, day, setWeek, setView, setDay]);
};
