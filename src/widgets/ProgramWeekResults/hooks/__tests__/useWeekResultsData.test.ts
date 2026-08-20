import { renderHook } from '@testing-library/react';

import { useWeekResultsData } from '../useWeekResultsData';

const mockUseProgramWeekResults = jest.fn();

jest.mock('../../../../../i18n', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string, values?: Record<string, number | string>) =>
    values ? `${key}:${Object.values(values).join(':')}` : key,
}));

jest.mock('../../../../entities/analytics', () => ({
  useProgramWeekResults: (...args: unknown[]) => mockUseProgramWeekResults(...args),
}));

jest.mock('../../../../entities/client', () => ({
  getClientAvatarSrc: (avatarUrl: string) => avatarUrl || undefined,
  getClientInitials: () => 'AT',
}));

jest.mock('../../../../shared/lib', () => ({
  formatDate: (value: string) => `formatted:${value}`,
  ROUTES: { userTraining: (clientUserId: string) => `/clients/${clientUserId}` },
}));

const createCell = (resultText: string, completionId: string | null) => ({
  status: completionId === null ? 'no_result' : 'submitted',
  completionId,
  resultText,
  completedAt: completionId === null ? null : '2026-08-19T10:00:00Z',
  comments: [],
});

describe('useWeekResultsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // IAC2: Sorted day options retain the API's day-to-client-cell positional alignment.
  it('sorts unique day numbers and reorders each client cells by the matching raw day index', () => {
    mockUseProgramWeekResults.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        days: [{ dayNumber: 5 }, { dayNumber: 1 }, { dayNumber: 3 }, { dayNumber: 1 }],
        clients: [
          {
            clientUserId: 'client-1',
            displayName: 'Alex Trainer',
            avatarUrl: '',
            isBehindLatest: false,
            completedDays: 2,
            totalDays: 4,
            days: [
              createCell('day-five', 'completion-5'),
              createCell('stale-day-one', null),
              createCell('day-three', 'completion-3'),
              createCell('final-day-one', 'completion-1'),
            ],
          },
        ],
        summary: {
          totalTrainingSlots: 4,
          submittedCount: 3,
          missingCount: 1,
          completionPercent: 75,
          behindClientsCount: 0,
        },
      },
    });

    const { result } = renderHook(() => useWeekResultsData('program-1', 2));

    expect(result.current.status).toBe('ready');
    if (result.current.status !== 'ready') throw new Error('Expected ready week results');
    expect(result.current.rawDayNumbers).toEqual([5, 1, 3, 1]);
    expect(result.current.dayNumbers).toEqual([1, 3, 5]);
    expect(result.current.clients[0]?.cells.map(({ dayNumber, resultText }) => ({ dayNumber, resultText }))).toEqual([
      { dayNumber: 1, resultText: 'final-day-one' },
      { dayNumber: 3, resultText: 'day-three' },
      { dayNumber: 5, resultText: 'day-five' },
    ]);
  });
});
