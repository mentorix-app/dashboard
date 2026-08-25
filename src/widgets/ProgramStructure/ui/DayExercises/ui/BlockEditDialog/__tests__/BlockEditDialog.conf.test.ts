import { act, renderHook } from '@testing-library/react';

import { ProgramBlockType, type ProgramDayBlock } from '../../../../../../../entities/program/model/structure';

import { useBlockEditDialogConfig } from '../BlockEditDialog.conf';

const mockPatchBlock = jest.fn();
const mockSetBlockClients = jest.fn();
const mockValidateAndGetClientIds = jest.fn();
const mockShowSuccessToast = jest.fn();

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../../../../../../../entities/program', () => ({
  parseProgramBlockError: () => 'unknown',
  usePatchProgramDayBlock: () => ({ isPending: false, mutateAsync: mockPatchBlock }),
  useSetProgramDayBlockClients: () => ({ isPending: false, mutateAsync: mockSetBlockClients }),
}));

jest.mock('../../../../../../../shared/hooks', () => ({
  useToast: () => ({ showSuccessToast: mockShowSuccessToast }),
}));

jest.mock('../../../hooks/useBlockVisibilityConfig', () => ({
  useBlockVisibilityConfig: () => ({ validateAndGetClientIds: mockValidateAndGetClientIds }),
}));

const createBlock = (instruction: string): ProgramDayBlock => ({
  id: 'block-1',
  blockType: ProgramBlockType.Complex,
  instruction,
  sortOrder: 1,
  clientUserIds: [],
  exercises: [],
  createdAt: '2026-08-25T00:00:00Z',
});

beforeEach(() => {
  jest.clearAllMocks();
  mockPatchBlock.mockResolvedValue(undefined);
  mockValidateAndGetClientIds.mockResolvedValue([]);
});

describe('useBlockEditDialogConfig', () => {
  it('patches metadata again after a successful save and reopen', async () => {
    const onOpenChange = jest.fn();
    const initialProps = { block: createBlock('Original'), open: true };
    const { result, rerender } = renderHook(
      ({ block, open }: typeof initialProps) =>
        useBlockEditDialogConfig({
          programId: 'program-1',
          weekId: 'week-1',
          block,
          isLastSharedBlock: false,
          open,
          onOpenChange,
        }),
      { initialProps }
    );

    await act(async () => {
      await result.current.handleSave({
        blockType: ProgramBlockType.Complex,
        instruction: 'First update',
      });
    });

    expect(result.current.metadataSaved).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    rerender({ block: createBlock('First update'), open: false });
    rerender({ block: createBlock('First update'), open: true });

    await act(async () => {
      await result.current.handleSave({
        blockType: ProgramBlockType.Complex,
        instruction: 'Second update',
      });
    });

    expect(mockPatchBlock).toHaveBeenCalledTimes(2);
    expect(mockPatchBlock).toHaveBeenLastCalledWith({
      programId: 'program-1',
      weekId: 'week-1',
      blockId: 'block-1',
      blockType: ProgramBlockType.Complex,
      instruction: 'Second update',
    });
    expect(mockSetBlockClients).not.toHaveBeenCalled();
    expect(mockShowSuccessToast).toHaveBeenCalledTimes(2);
  });
});
