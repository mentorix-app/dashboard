import { act, renderHook } from '@testing-library/react';

import { useBlockVisibilityForm } from '../useBlockVisibilityForm';

const noClients: string[] = [];
const selectedClients = ['client-1'];

describe('useBlockVisibilityForm', () => {
  it('restricts visibility to a client when the client is added', () => {
    const { result } = renderHook(() => useBlockVisibilityForm({ open: true, initialClientUserIds: noClients }));

    act(() => result.current.handleClientChange('client-1', true));

    expect(result.current.mode).toBe('restricted');
    expect(result.current.selectedClientUserIds).toEqual(['client-1']);
  });

  it('restores shared visibility when the final client is removed', () => {
    const { result } = renderHook(() => useBlockVisibilityForm({ open: true, initialClientUserIds: selectedClients }));

    act(() => result.current.handleClientChange('client-1', false));

    expect(result.current.mode).toBe('shared');
    expect(result.current.selectedClientUserIds).toEqual([]);
  });
});
