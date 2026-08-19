import { act, waitFor } from '@testing-library/react';

import { queryKeys } from '@/src/shared/api';
import { createTestQueryClient, renderHookWithClient } from '@/src/shared/api/__tests__/queryClientTestUtils';

import { useSetProgramDayBlockClients } from '../useProgramBlocks';

jest.mock('../../../../shared/api/base.http', () => ({
  http: { put: jest.fn() },
}));

import { http } from '../../../../shared/api/base.http';

const mockedPut = jest.mocked(http.put);

afterEach(() => jest.clearAllMocks());

describe('useSetProgramDayBlockClients', () => {
  it('fully replaces block clients and writes the returned program into cache', async () => {
    const program = { id: 'program-1' };
    mockedPut.mockResolvedValue({ data: program });
    const client = createTestQueryClient();
    const setQueriesDataSpy = jest.spyOn(client, 'setQueriesData');
    const { result } = renderHookWithClient(() => useSetProgramDayBlockClients(), { client });

    await act(async () => {
      await result.current.mutateAsync({
        programId: 'program-1',
        weekId: 'week-1',
        blockId: 'block-1',
        clientUserIds: ['client-1', 'client-2'],
      });
    });

    expect(mockedPut).toHaveBeenCalledWith('/programs/program-1/weeks/week-1/blocks/block-1/clients', {
      clientUserIds: ['client-1', 'client-2'],
    });
    await waitFor(() => expect(result.current.data).toEqual(program));
    expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: queryKeys.programs.detail('program-1') }, program);
  });

  it('sends an empty list to restore shared visibility', async () => {
    mockedPut.mockResolvedValue({ data: { id: 'program-1' } });
    const { result } = renderHookWithClient(() => useSetProgramDayBlockClients());

    await act(async () => {
      await result.current.mutateAsync({
        programId: 'program-1',
        weekId: 'week-1',
        blockId: 'block-1',
        clientUserIds: [],
      });
    });

    expect(mockedPut).toHaveBeenCalledWith('/programs/program-1/weeks/week-1/blocks/block-1/clients', {
      clientUserIds: [],
    });
  });
});
