import { act, renderHook } from '@testing-library/react';

import { useWizardActions } from '../useWizardActions';

const ProgramStatus = { Draft: 'draft', Published: 'published', Archived: 'archived' } as const;

const mockUseProgram = jest.fn();
const mockUseProgramAssignments = jest.fn();
const mockArchiveMutate = jest.fn();
const mockPublishMutate = jest.fn();
const mockPublishUpdateMutate = jest.fn();
const mockSyncMutate = jest.fn();
const mockDiscardMutate = jest.fn();
const mockConfirm = jest.fn();
const mockShowSuccessToast = jest.fn();
const mockShowErrorToast = jest.fn();
const mockMutationState = {
  archive: false,
  publish: false,
  publishUpdate: false,
  sync: false,
  discard: false,
};

jest.mock('../../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../../../../entities/program', () => ({
  ProgramStatus: { Draft: 'draft', Published: 'published', Archived: 'archived' },
  canManageProgram: () => true,
  useArchiveProgram: () => ({ mutate: mockArchiveMutate, isPending: mockMutationState.archive }),
  useDiscardProgramChanges: () => ({ mutate: mockDiscardMutate, isPending: mockMutationState.discard }),
  useProgram: (...args: unknown[]) => mockUseProgram(...args),
  useProgramAssignments: (...args: unknown[]) => mockUseProgramAssignments(...args),
  usePublishProgram: () => ({ mutate: mockPublishMutate, isPending: mockMutationState.publish }),
  usePublishProgramUpdate: () => ({ mutate: mockPublishUpdateMutate, isPending: mockMutationState.publishUpdate }),
  useSyncProgramAssignments: () => ({ mutate: mockSyncMutate, isPending: mockMutationState.sync }),
}));

jest.mock('../../../../entities/user', () => ({
  useCapabilities: () => ({ isTrainer: true }),
  useCurrentUser: () => ({ userId: 'trainer-1' }),
}));

jest.mock('../../../../shared/hooks', () => ({
  useToast: () => ({ showSuccessToast: mockShowSuccessToast, showErrorToast: mockShowErrorToast }),
}));

jest.mock('../../../../shared/ui', () => ({
  confirm: (options: unknown) => mockConfirm(options),
}));

type ConfirmOptions = { onConfirm: () => Promise<void> | void };

beforeEach(() => {
  mockUseProgram.mockReturnValue({ data: { status: ProgramStatus.Published, hasUnpublishedChanges: true } });
  mockUseProgramAssignments.mockReturnValue({ data: { items: [] } });
  mockMutationState.archive = false;
  mockMutationState.publish = false;
  mockMutationState.publishUpdate = false;
  mockMutationState.sync = false;
  mockMutationState.discard = false;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useWizardActions - requestRevert', () => {
  it('discards changes and shows a success toast on confirm', async () => {
    mockDiscardMutate.mockImplementation((_id, handlers) => handlers.onSuccess());
    const { result } = renderHook(() => useWizardActions('program-1'));

    result.current.requestRevert();

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    const options = mockConfirm.mock.calls[0][0] as ConfirmOptions;
    await act(async () => {
      await options.onConfirm();
    });

    expect(mockDiscardMutate).toHaveBeenCalledWith('program-1', expect.any(Object));
    expect(mockShowSuccessToast).toHaveBeenCalledWith('actions.toast.discardSuccess');
  });

  it('shows an error toast when the discard request fails', async () => {
    const error = { message: 'boom' };
    mockDiscardMutate.mockImplementation((_id, handlers) => handlers.onError(error));
    const { result } = renderHook(() => useWizardActions('program-1'));

    result.current.requestRevert();
    const options = mockConfirm.mock.calls[0][0] as ConfirmOptions;

    await expect(options.onConfirm()).rejects.toBe(error);
    expect(mockShowErrorToast).toHaveBeenCalledWith('actions.toast.discardError', { description: 'boom' });
  });
});

describe('useWizardActions - isActionPending', () => {
  it('is false when no lifecycle mutation is in flight', () => {
    const { result } = renderHook(() => useWizardActions('program-1'));
    expect(result.current.isActionPending).toBe(false);
  });

  it('is true while the discard mutation is pending', () => {
    mockMutationState.discard = true;
    const { result } = renderHook(() => useWizardActions('program-1'));
    expect(result.current.isActionPending).toBe(true);
  });
});
