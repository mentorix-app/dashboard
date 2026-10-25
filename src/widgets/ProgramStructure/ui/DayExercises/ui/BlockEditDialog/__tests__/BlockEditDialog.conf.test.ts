import { act, renderHook } from '@testing-library/react';

import { EMPTY_BLOCK_SETTINGS } from '../../../../../../../entities/program/model/blockSettings';
import {
  ProgramBlockType,
  type ProgramDayBlock,
  type ProgramDayExercise,
} from '../../../../../../../entities/program/model/structure';

import { useBlockEditDialogConfig } from '../BlockEditDialog.conf';
import type { BlockEditValue } from '../BlockEditDialog.types';

const mockPatchBlock = jest.fn();
const mockSetBlockClients = jest.fn();
const mockValidateAndGetClientIds = jest.fn();
const mockShowSuccessToast = jest.fn();
const mockConfirm = jest.fn();

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../../../../../../../entities/program', () => ({
  ...jest.requireActual('../../../../../../../entities/program/model/blockSettings'),
  ...jest.requireActual('../../../../../../../entities/program/model/structure'),
  parseProgramBlockError: () => 'unknown',
  usePatchProgramDayBlock: () => ({ isPending: false, mutateAsync: mockPatchBlock }),
  useSetProgramDayBlockClients: () => ({ isPending: false, mutateAsync: mockSetBlockClients }),
}));

jest.mock('../../../../../../../shared/hooks', () => ({
  useToast: () => ({ showSuccessToast: mockShowSuccessToast }),
}));

jest.mock('../../../../../../../shared/ui', () => ({
  confirm: (options: unknown) => mockConfirm(options),
}));

jest.mock('../../../hooks/useBlockVisibilityConfig', () => ({
  useBlockVisibilityConfig: () => ({ validateAndGetClientIds: mockValidateAndGetClientIds }),
}));

const buildExercise = (id: string, sets: string | null): ProgramDayExercise => ({
  id,
  exerciseId: `${id}-def`,
  exerciseName: id,
  exerciseNameRu: id,
  sortOrder: 1,
  sets,
  reps: '10',
  instruction: '',
  createdAt: '2026-08-25T00:00:00Z',
});

const createBlock = (overrides: Partial<ProgramDayBlock> = {}): ProgramDayBlock => ({
  id: 'block-1',
  blockType: ProgramBlockType.SkillWork,
  instruction: 'Original',
  sortOrder: 1,
  clientUserIds: [],
  exercises: [],
  createdAt: '2026-08-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
  ...overrides,
});

const buildValue = (overrides: Partial<BlockEditValue> = {}): BlockEditValue => ({
  blockType: ProgramBlockType.SkillWork,
  instruction: 'Original',
  settings: EMPTY_BLOCK_SETTINGS,
  ...overrides,
});

const renderConfig = (block: ProgramDayBlock, onOpenChange = jest.fn()) =>
  renderHook(
    ({ current, open }: { current: ProgramDayBlock; open: boolean }) =>
      useBlockEditDialogConfig({
        programId: 'program-1',
        weekId: 'week-1',
        block: current,
        isLastSharedBlock: false,
        open,
        onOpenChange,
      }),
    { initialProps: { current: block, open: true } }
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockPatchBlock.mockResolvedValue(undefined);
  mockValidateAndGetClientIds.mockResolvedValue([]);
});

describe('useBlockEditDialogConfig', () => {
  it('patches metadata again after a successful save and reopen', async () => {
    const onOpenChange = jest.fn();
    const { result, rerender } = renderConfig(createBlock(), onOpenChange);

    await act(async () => {
      await result.current.handleSave(buildValue({ instruction: 'First update' }));
    });

    expect(result.current.metadataSaved).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    rerender({ current: createBlock({ instruction: 'First update' }), open: false });
    rerender({ current: createBlock({ instruction: 'First update' }), open: true });

    await act(async () => {
      await result.current.handleSave(buildValue({ instruction: 'Second update' }));
    });

    expect(mockPatchBlock).toHaveBeenCalledTimes(2);
    expect(mockPatchBlock).toHaveBeenLastCalledWith({
      programId: 'program-1',
      weekId: 'week-1',
      blockId: 'block-1',
      blockType: ProgramBlockType.SkillWork,
      instruction: 'Second update',
    });
    expect(mockSetBlockClients).not.toHaveBeenCalled();
    expect(mockShowSuccessToast).toHaveBeenCalledTimes(2);
  });

  it('sends only the settings the resulting type takes, null when cleared', async () => {
    const { result } = renderConfig(createBlock({ blockType: ProgramBlockType.Emom, rounds: 10 }));

    await act(async () => {
      await result.current.handleSave(
        buildValue({
          blockType: ProgramBlockType.Intervals,
          settings: { ...EMPTY_BLOCK_SETTINGS, rounds: 8, workSec: 20 },
        })
      );
    });

    expect(mockPatchBlock).toHaveBeenCalledWith({
      programId: 'program-1',
      weekId: 'week-1',
      blockId: 'block-1',
      blockType: ProgramBlockType.Intervals,
      instruction: 'Original',
      rounds: 8,
      workSec: 20,
      restSec: null,
    });
  });

  it('skips the PATCH when nothing the type takes has changed', async () => {
    const { result } = renderConfig(createBlock({ blockType: ProgramBlockType.Emom, rounds: 10 }));

    await act(async () => {
      await result.current.handleSave(
        buildValue({ blockType: ProgramBlockType.Emom, settings: { ...EMPTY_BLOCK_SETTINGS, rounds: 10 } })
      );
    });

    expect(mockPatchBlock).not.toHaveBeenCalled();
    expect(mockShowSuccessToast).toHaveBeenCalledTimes(1);
  });

  it('reports a failed block save as a block error, not a visibility one', async () => {
    mockPatchBlock.mockRejectedValue(new Error('boom'));
    const onOpenChange = jest.fn();
    const { result } = renderConfig(createBlock(), onOpenChange);

    await act(async () => {
      await result.current.handleSave(buildValue({ instruction: 'Changed' }));
    });

    expect(result.current.errorKey).toBe('blockUpdateFailed');
    expect(result.current.metadataSaved).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('asks before a change that clears exercise sets and saves only on confirm', async () => {
    const block = createBlock({ exercises: [buildExercise('a', '3'), buildExercise('b', null)] });
    const { result } = renderConfig(block);

    await act(async () => {
      await result.current.handleSave(
        buildValue({ blockType: ProgramBlockType.Emom, settings: { ...EMPTY_BLOCK_SETTINGS, rounds: 10 } })
      );
    });

    expect(mockPatchBlock).not.toHaveBeenCalled();
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    const [{ onConfirm }] = mockConfirm.mock.calls[0];

    await act(async () => {
      await onConfirm();
    });

    expect(mockPatchBlock).toHaveBeenCalledWith(
      expect.objectContaining({ blockType: ProgramBlockType.Emom, rounds: 10 })
    );
  });
});
