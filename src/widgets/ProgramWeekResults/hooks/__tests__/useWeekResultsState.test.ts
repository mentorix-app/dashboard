import { act, renderHook } from '@testing-library/react';

import { useWeekResultsState } from '../useWeekResultsState';

const mockUseSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

const setUrl = (query = '') => {
  const url = query ? `/en/programs/program-1/results?${query}` : '/en/programs/program-1/results';
  window.history.replaceState(null, '', url);
  mockUseSearchParams.mockReturnValue(new URLSearchParams(query));
};

describe('useWeekResultsState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUrl();
  });

  // AC1: A clean URL selects the final week in raw API order.
  it('uses the final raw week for a clean URL', () => {
    const { result } = renderHook(() => useWeekResultsState([5, 1, 3]));

    expect(result.current.week).toBe(3);
  });

  // AC2: Valid explicit week and day selections are preserved.
  it('preserves valid explicit week and day values', () => {
    setUrl('week=1&day=4');

    const { result } = renderHook(() => useWeekResultsState([5, 1, 3]));

    expect(result.current.week).toBe(1);
    expect(result.current.day).toBe(4);
  });

  // AC3: Manual week selection updates week and removes day in one native history entry.
  it('pushes one history entry that changes the week and removes the day', () => {
    setUrl('week=1&day=4&view=list&q=alex');
    const pushState = jest.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useWeekResultsState([5, 1, 3]));

    act(() => result.current.setWeek(5));

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState).toHaveBeenCalledWith(null, '', '/en/programs/program-1/results?week=5&view=list&q=alex');
  });
});
