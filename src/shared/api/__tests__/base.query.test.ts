import { waitFor } from '@testing-library/react';

import { useGet, useInfiniteGet } from '../base.query';
import { http } from '../base.http';
import { renderHookWithClient } from './queryClientTestUtils';

jest.mock('../base.http', () => ({
  http: { get: jest.fn() },
}));

const mockedGet = http.get as jest.MockedFunction<typeof http.get>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGet', () => {
  it('fetches the url and resolves with the response data', async () => {
    mockedGet.mockResolvedValue({ data: { id: '1' } });

    const { result } = renderHookWithClient(() => useGet<{ id: string }>('/foo', ['foo']));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: '1' });
    expect(mockedGet).toHaveBeenCalledWith('/foo', undefined);
  });

  it('forwards the axios config to the http client', async () => {
    mockedGet.mockResolvedValue({ data: [] });

    const { result } = renderHookWithClient(() => useGet('/foo', ['foo'], undefined, { params: { q: 'x' } }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith('/foo', { params: { q: 'x' } });
  });

  it('surfaces a rejected request as an error result', async () => {
    mockedGet.mockRejectedValue(new Error('network down'));

    const { result } = renderHookWithClient(() => useGet('/foo', ['foo']));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useInfiniteGet', () => {
  it('requests the first page using buildParams and initialPageParam', async () => {
    mockedGet.mockResolvedValue({ data: { items: [1, 2], nextPage: 2 } });
    const buildParams = jest.fn((page: number) => ({ page }));
    const getNextPageParam = (last: { nextPage?: number }) => last.nextPage;

    const { result } = renderHookWithClient(() =>
      useInfiniteGet<{ items: number[]; nextPage?: number }>('/bar', ['bar'], buildParams, getNextPageParam)
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(buildParams).toHaveBeenCalledWith(1);
    expect(mockedGet).toHaveBeenCalledWith('/bar', { params: { page: 1 } });
    expect(result.current.data?.pages[0]).toEqual({ items: [1, 2], nextPage: 2 });
  });

  it('exposes hasNextPage as false once getNextPageParam returns undefined', async () => {
    mockedGet.mockResolvedValue({ data: { items: [1], nextPage: undefined } });

    const { result } = renderHookWithClient(() =>
      useInfiniteGet<{ items: number[]; nextPage?: number }>(
        '/bar',
        ['bar'],
        (page) => ({ page }),
        (last) => last.nextPage
      )
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });
});
