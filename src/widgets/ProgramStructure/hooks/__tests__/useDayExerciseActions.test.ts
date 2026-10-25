import { act, renderHook } from '@testing-library/react';

import { useDayExerciseActions } from '../useDayExerciseActions';

const mockUpdate = jest.fn();
const mockDuplicate = jest.fn();
const mockMove = jest.fn();
const mockShowSuccessToast = jest.fn();
const mockShowErrorToast = jest.fn();

const idleMutation = () => ({ mutate: jest.fn(), mutateAsync: jest.fn() });

jest.mock('../../../../../i18n', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

const mockParseError = jest.fn((error: unknown) =>
  error instanceof Error && error.message === '404' ? 'notFound' : 'unknown'
);

jest.mock('../../../../entities/program', () => ({
  parseProgramBlockError: (error: unknown) => mockParseError(error),
  useAddProgramBlockExercise: () => idleMutation(),
  useCreateProgramDayBlock: () => idleMutation(),
  useDeleteProgramBlockExercise: () => idleMutation(),
  useDuplicateProgramBlockExercise: () => ({ mutateAsync: mockDuplicate }),
  useExtractProgramBlockExercise: () => idleMutation(),
  useMoveProgramExerciseToBlock: () => ({ mutateAsync: mockMove }),
  useReorderProgramBlockExercises: () => idleMutation(),
  useUpdateProgramBlockExercise: () => ({ mutateAsync: mockUpdate }),
}));

jest.mock('../../../../features/ExercisePicker', () => ({ MAX_PICK: 20 }));

jest.mock('../../../../shared/hooks', () => ({
  useToast: () => ({ showSuccessToast: mockShowSuccessToast, showErrorToast: mockShowErrorToast }),
}));

const input = { exerciseId: 'exercise-1', sets: '3', reps: '10', instruction: '' };

const setup = () => renderHook(() => useDayExerciseActions({ programId: 'p', weekId: 'w', dayId: 'd' }));

beforeEach(() => {
  jest.clearAllMocks();
  mockDuplicate.mockResolvedValue({});
  mockMove.mockResolvedValue({});
});

describe('useDayExerciseActions', () => {
  it('waits for the row update in flight before duplicating it', async () => {
    let resolveUpdate: () => void = () => {};
    mockUpdate.mockReturnValue(new Promise<void>((resolve) => (resolveUpdate = resolve)));
    const { result } = setup();

    act(() => result.current.handleUpdateExercise('block-1', 'item-1', input));
    let duplicate: Promise<void> = Promise.resolve();
    act(() => {
      duplicate = result.current.handleDuplicateExercise('block-1', 'item-1');
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockDuplicate).not.toHaveBeenCalled();

    await act(async () => {
      resolveUpdate();
      await duplicate;
    });
    expect(mockDuplicate).toHaveBeenCalledWith({ programId: 'p', weekId: 'w', blockId: 'block-1', itemId: 'item-1' });
    expect(mockShowSuccessToast).toHaveBeenCalledWith('structure.exercises.toast.exerciseDuplicated');
  });

  it('still duplicates after a failed update and reports the update error', async () => {
    mockUpdate.mockRejectedValue(new Error('boom'));
    const { result } = setup();

    act(() => result.current.handleUpdateExercise('block-1', 'item-1', input));
    await act(async () => {
      await result.current.handleDuplicateExercise('block-1', 'item-1');
    });

    expect(mockShowErrorToast).toHaveBeenCalledWith('structure.exercises.toast.exerciseUpdateError');
    expect(mockDuplicate).toHaveBeenCalledTimes(1);
  });

  it('explains a duplicate of an exercise that no longer exists', async () => {
    mockDuplicate.mockRejectedValue(new Error('404'));
    const { result } = setup();

    await act(async () => {
      await result.current.handleDuplicateExercise('block-1', 'gone');
    });

    expect(mockShowErrorToast).toHaveBeenCalledWith('structure.exercises.toast.exerciseDuplicateNotFound');
  });

  it('mentions removed sets in the move toast when the target block has none', async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.handleMoveExerciseToBlock('block-1', 'item-1', 'block-2', undefined, 'EMOM');
    });

    expect(mockShowSuccessToast).toHaveBeenCalledWith('structure.exercises.toast.exerciseMoved', {
      description: 'structure.exercises.toast.setsCleared:{"type":"EMOM"}',
    });
  });
});
