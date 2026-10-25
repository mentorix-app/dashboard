import { act } from '@testing-library/react';

import { queryKeys } from '@/src/shared/api';
import { createTestQueryClient, renderHookWithClient } from '@/src/shared/api/__tests__/queryClientTestUtils';

import { useDuplicateProgramBlockExercise } from '../useProgramExercises';

jest.mock('../../../../shared/api/base.http', () => ({
  http: { post: jest.fn() },
}));

import { http } from '../../../../shared/api/base.http';

const mockedPost = jest.mocked(http.post);

afterEach(() => jest.clearAllMocks());

describe('useDuplicateProgramBlockExercise', () => {
  it('posts to the duplicate route without a body and writes the returned program into cache', async () => {
    const program = { id: 'program-1' };
    mockedPost.mockResolvedValue({ data: program });
    const client = createTestQueryClient();
    const setQueriesDataSpy = jest.spyOn(client, 'setQueriesData');
    const { result } = renderHookWithClient(() => useDuplicateProgramBlockExercise(), { client });

    await act(async () => {
      await result.current.mutateAsync({
        programId: 'program-1',
        weekId: 'week-1',
        blockId: 'block-1',
        itemId: 'item 1',
      });
    });

    expect(mockedPost).toHaveBeenCalledWith(
      '/programs/program-1/weeks/week-1/blocks/block-1/exercises/item%201/duplicate'
    );
    expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: queryKeys.programs.detail('program-1') }, program);
  });
});
