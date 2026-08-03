import { act, renderHook } from '@testing-library/react';

import { ProgramCategory, ProgramStatus, type Program } from '../../../../entities/program/model/types';
import { useProgramRevertSignalStore } from '../../../../entities/program/model/revertSignalStore';

import { useProgramBasicsForm } from '../useProgramBasicsForm';

const mockUseProgram = jest.fn();

jest.mock('../../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../../../../entities/program', () => ({
  toProgramDraftFields: jest.requireActual('../../../../entities/program/lib/toProgramDraftFields')
    .toProgramDraftFields,
  useProgram: (...args: unknown[]) => mockUseProgram(...args),
  useProgramRevertSignalStore: jest.requireActual('../../../../entities/program/model/revertSignalStore')
    .useProgramRevertSignalStore,
  ProgramCategory: jest.requireActual('../../../../entities/program/model/types').ProgramCategory,
}));

const buildProgram = (overrides: Partial<Program> = {}): Program => ({
  id: 'program-1',
  createdBy: 'trainer-1',
  createdByName: 'Trainer',
  modifiedBy: 'trainer-1',
  status: ProgramStatus.Published,
  name: 'Original name',
  nameRu: 'Оригинальное имя',
  description: 'Original description',
  descriptionRu: 'Оригинальное описание',
  category: ProgramCategory.Endurance,
  difficulty: null,
  previewImageUrl: '',
  latestProgramVersionId: 'version-1',
  latestClientPlanAt: '2024-01-01T00:00:00Z',
  hasUnpublishedChanges: false,
  trainingDaysCount: 0,
  assignmentCount: 0,
  createdAt: '2024-01-01T00:00:00Z',
  modifiedAt: '2024-01-01T00:00:00Z',
  deletedAt: null,
  ...overrides,
});

afterEach(() => {
  jest.clearAllMocks();
  useProgramRevertSignalStore.setState({ programId: null, revertedAt: 0 });
});

describe('useProgramBasicsForm', () => {
  it('hydrates the form from the fetched program on first load', () => {
    mockUseProgram.mockReturnValue({ data: buildProgram(), isLoading: false });
    const { result } = renderHook(() => useProgramBasicsForm('program-1'));

    expect(result.current.form.getValues().name).toBe('Original name');
  });

  it('does not re-hydrate on an ordinary refetch, so in-progress edits are preserved', () => {
    mockUseProgram.mockReturnValue({ data: buildProgram(), isLoading: false });
    const { result, rerender } = renderHook(() => useProgramBasicsForm('program-1'));

    act(() => {
      result.current.form.setValue('name', 'Edited by user');
    });
    mockUseProgram.mockReturnValue({ data: buildProgram({ name: 'Changed on server' }), isLoading: false });
    rerender();

    expect(result.current.form.getValues().name).toBe('Edited by user');
  });

  it('re-hydrates general info from the restored program after a revert signal', () => {
    mockUseProgram.mockReturnValue({ data: buildProgram(), isLoading: false });
    const { result, rerender } = renderHook(() => useProgramBasicsForm('program-1'));

    act(() => {
      result.current.form.setValue('name', 'Unpublished edit');
    });

    const restoredProgram = buildProgram({ name: 'Restored published name' });
    mockUseProgram.mockReturnValue({ data: restoredProgram, isLoading: false });
    act(() => {
      useProgramRevertSignalStore.getState().markReverted('program-1');
    });
    rerender();

    expect(result.current.form.getValues().name).toBe('Restored published name');
  });

  it('does not re-hydrate for a revert signal belonging to a different program', () => {
    mockUseProgram.mockReturnValue({ data: buildProgram(), isLoading: false });
    const { result, rerender } = renderHook(() => useProgramBasicsForm('program-1'));

    act(() => {
      result.current.form.setValue('name', 'Edited by user');
    });
    act(() => {
      useProgramRevertSignalStore.getState().markReverted('program-2');
    });
    mockUseProgram.mockReturnValue({ data: buildProgram({ name: 'Changed on server' }), isLoading: false });
    rerender();

    expect(result.current.form.getValues().name).toBe('Edited by user');
  });
});
