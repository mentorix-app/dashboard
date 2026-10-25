import { act, renderHook } from '@testing-library/react';

import { EMPTY_BLOCK_SETTINGS } from '../../../../../../../entities/program/model/blockSettings';
import {
  ProgramBlockType,
  type ProgramDay,
  type ProgramDayBlock,
  type ProgramWeek,
} from '../../../../../../../entities/program/model/structure';

import { useCopyBlockFormConfig } from '../ui/CopyBlockForm/CopyBlockForm.conf';

const mockUseProgram = jest.fn();

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

jest.mock('../../../../../../../entities/program', () => ({
  useProgram: (id: string) => mockUseProgram(id),
}));

const buildBlock = (id: string, clientUserIds: string[] = []): ProgramDayBlock => ({
  id,
  blockType: ProgramBlockType.Superset,
  instruction: '',
  sortOrder: 1,
  clientUserIds,
  exercises: [],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
});

const buildDay = (id: string, dayNumber: number, blocks: ProgramDayBlock[]): ProgramDay => ({
  id,
  dayNumber,
  sortOrder: dayNumber,
  blocks,
  createdAt: '2026-10-25T00:00:00Z',
});

const buildWeek = (id: string, weekNumber: number, days: ProgramDay[]): ProgramWeek => ({
  id,
  weekNumber,
  sortOrder: weekNumber,
  days,
  createdAt: '2026-10-25T00:00:00Z',
});

const source = buildBlock('source', ['client-1']);
const weeks = [
  buildWeek('w1', 1, [buildDay('d1', 1, [buildBlock('shared'), source])]),
  buildWeek('w2', 2, [buildDay('d2', 1, []), buildDay('d3', 3, [buildBlock('other')])]),
];

const setup = (onCopy = jest.fn().mockResolvedValue(true)) => {
  const onPendingChange = jest.fn();
  const onClose = jest.fn();
  const view = renderHook(() =>
    useCopyBlockFormConfig({
      programId: 'program-1',
      sourceWeekId: 'w1',
      sourceDayId: 'd1',
      block: source,
      getExerciseLabel: (exercise) => exercise.exerciseName,
      onCopy,
      onPendingChange,
      onClose,
    })
  );
  return { ...view, onCopy, onPendingChange, onClose };
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseProgram.mockReturnValue({ data: { weeks } });
});

describe('useCopyBlockFormConfig', () => {
  it('starts on the source week with no day selected', () => {
    const { result } = setup();

    expect(result.current.selectedWeek?.id).toBe('w1');
    expect(result.current.selectedDay).toBeNull();
    expect(result.current.weeks.map((week) => week.id)).toEqual(['w1', 'w2']);
    expect(result.current.restrictedClientCount).toBe(1);
  });

  it('clears the day when the week changes', () => {
    const { result } = setup();

    act(() => result.current.handleDaySelect('d1'));
    expect(result.current.selectedDay?.id).toBe('d1');

    act(() => result.current.handleWeekChange('w2'));
    expect(result.current.selectedWeek?.id).toBe('w2');
    expect(result.current.selectedDay).toBeNull();
  });

  it('warns when the restricted copy lands in a day without a shared block', () => {
    const { result } = setup();

    act(() => result.current.handleWeekChange('w2'));
    act(() => result.current.handleDaySelect('d2'));
    expect(result.current.showSharedBlockWarning).toBe(true);

    act(() => result.current.handleDaySelect('d3'));
    expect(result.current.showSharedBlockWarning).toBe(false);

    act(() => result.current.handleWeekChange('w1'));
    act(() => result.current.handleDaySelect('d1'));
    expect(result.current.showSharedBlockWarning).toBe(false);
  });

  it('copies to the chosen day with a week/day message and closes on success', async () => {
    const { result, onCopy, onPendingChange, onClose } = setup();

    act(() => result.current.handleWeekChange('w2'));
    act(() => result.current.handleDaySelect('d3'));
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onCopy).toHaveBeenCalledWith('source', 'd3', 'structure.blocks.toast.blockCopied:{"week":2,"day":3}');
    expect(onPendingChange.mock.calls).toEqual([[true], [false]]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses the same-day message and stays open when the copy fails', async () => {
    const { result, onCopy, onClose } = setup(jest.fn().mockResolvedValue(false));

    act(() => result.current.handleDaySelect('d1'));
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onCopy).toHaveBeenCalledWith('source', 'd1', 'structure.blocks.toast.blockCopiedSameDay');
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(false);
  });

  it('does nothing without a selected day', async () => {
    const { result, onCopy } = setup();

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onCopy).not.toHaveBeenCalled();
  });
});
