import { act, renderHook } from '@testing-library/react';

import type { User } from '../types';
import { UserRole } from '../types';
import { useUserStore } from '../store';

const baseUser: User = {
  userId: 'u1',
  email: 'trainer@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  roles: [UserRole.Trainer],
};

describe('useUserStore', () => {
  afterEach(() => {
    act(() => {
      useUserStore.setState({ user: null });
    });
  });

  it('starts with no user', () => {
    expect(useUserStore.getState().user).toBeNull();
  });

  it('setUser stores the given user', () => {
    const { result } = renderHook(() => useUserStore((state) => state));

    act(() => {
      result.current.setUser(baseUser);
    });

    expect(useUserStore.getState().user).toEqual(baseUser);
  });

  it('setUser(null) clears the user', () => {
    act(() => {
      useUserStore.setState({ user: baseUser });
    });
    const { result } = renderHook(() => useUserStore((state) => state));

    act(() => {
      result.current.setUser(null);
    });

    expect(useUserStore.getState().user).toBeNull();
  });

  it('clearUser resets the user to null', () => {
    act(() => {
      useUserStore.setState({ user: baseUser });
    });
    const { result } = renderHook(() => useUserStore((state) => state));

    act(() => {
      result.current.clearUser();
    });

    expect(useUserStore.getState().user).toBeNull();
  });
});
