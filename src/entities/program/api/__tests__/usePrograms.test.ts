import { act, waitFor } from '@testing-library/react';

import { queryKeys } from '@/src/shared/api';
import { createTestQueryClient, renderHookWithClient } from '@/src/shared/api/__tests__/queryClientTestUtils';

import { useDiscardProgramChanges } from '../usePrograms';
import { useProgramRevertSignalStore } from '../../model/revertSignalStore';

jest.mock('../../../../shared/api/base.http', () => ({
  http: { post: jest.fn() },
}));

import { http } from '../../../../shared/api/base.http';

const mockedHttp = http as unknown as { post: jest.Mock };

afterEach(() => {
  jest.clearAllMocks();
  useProgramRevertSignalStore.setState({ programId: null, revertedAt: 0 });
});

describe('useDiscardProgramChanges', () => {
  it('writes the restored program into the detail cache, invalidates the list, and signals the revert on success', async () => {
    const program = { id: 'program-1' };
    mockedHttp.post.mockResolvedValue({ data: program });
    const client = createTestQueryClient();
    const setQueriesDataSpy = jest.spyOn(client, 'setQueriesData');
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');
    const { result } = renderHookWithClient(() => useDiscardProgramChanges(), { client });

    await act(async () => {
      await result.current.mutateAsync('program-1');
    });

    expect(mockedHttp.post).toHaveBeenCalledWith('/programs/program-1/discard-unpublished');
    await waitFor(() => expect(result.current.data).toEqual(program));
    expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: queryKeys.programs.detail('program-1') }, program);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.programs.all, refetchType: 'none' });
    expect(useProgramRevertSignalStore.getState()).toMatchObject({ programId: 'program-1', revertedAt: 1 });
  });

  it('does not touch the cache or the revert signal when the request fails', async () => {
    mockedHttp.post.mockRejectedValue(new Error('boom'));
    const client = createTestQueryClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');
    const { result } = renderHookWithClient(() => useDiscardProgramChanges(), { client });

    await act(async () => {
      await result.current.mutateAsync('program-1').catch(() => undefined);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(useProgramRevertSignalStore.getState().revertedAt).toBe(0);
  });
});
