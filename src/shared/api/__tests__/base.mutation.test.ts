import { act, waitFor } from '@testing-library/react';

import { useDelete, usePatch, usePost, usePut } from '../base.mutation';
import { http } from '../base.http';
import { renderHookWithClient } from './queryClientTestUtils';

jest.mock('../base.http', () => ({
  http: { post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const mockedHttp = http as unknown as {
  post: jest.Mock;
  put: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('usePost', () => {
  it('posts the variables to the url and resolves with the response data', async () => {
    mockedHttp.post.mockResolvedValue({ data: { id: '1' } });
    const { result } = renderHookWithClient(() => usePost<{ id: string }, unknown, { name: string }>('/foo'));

    await act(async () => {
      await result.current.mutateAsync({ name: 'bar' });
    });

    expect(mockedHttp.post).toHaveBeenCalledWith('/foo', { name: 'bar' }, undefined);
    await waitFor(() => expect(result.current.data).toEqual({ id: '1' }));
  });
});

describe('usePut', () => {
  it('sends a PUT request with the variables', async () => {
    mockedHttp.put.mockResolvedValue({ data: { ok: true } });
    const { result } = renderHookWithClient(() => usePut<{ ok: boolean }, unknown, { id: string }>('/foo/1'));

    await act(async () => {
      await result.current.mutateAsync({ id: '1' });
    });

    expect(mockedHttp.put).toHaveBeenCalledWith('/foo/1', { id: '1' }, undefined);
  });
});

describe('usePatch', () => {
  it('sends a PATCH request with the variables', async () => {
    mockedHttp.patch.mockResolvedValue({ data: { ok: true } });
    const { result } = renderHookWithClient(() => usePatch<{ ok: boolean }, unknown, { name: string }>('/foo/1'));

    await act(async () => {
      await result.current.mutateAsync({ name: 'baz' });
    });

    expect(mockedHttp.patch).toHaveBeenCalledWith('/foo/1', { name: 'baz' }, undefined);
  });
});

describe('useDelete', () => {
  it('sends the variables as the request body of a DELETE request', async () => {
    mockedHttp.delete.mockResolvedValue({ data: null });
    const { result } = renderHookWithClient(() => useDelete<null, unknown, { ids: string[] }>('/foo'));

    await act(async () => {
      await result.current.mutateAsync({ ids: ['1', '2'] });
    });

    expect(mockedHttp.delete).toHaveBeenCalledWith('/foo', { data: { ids: ['1', '2'] } });
  });

  it('surfaces a rejected mutation as an error result', async () => {
    mockedHttp.delete.mockRejectedValue(new Error('boom'));
    const { result } = renderHookWithClient(() => useDelete('/foo'));

    await act(async () => {
      await result.current.mutateAsync(undefined).catch(() => undefined);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
