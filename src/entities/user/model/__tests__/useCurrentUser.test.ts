import { act, renderHook } from '@testing-library/react';

import type { User } from '../types';
import { UserRole } from '../types';
import { useUserStore } from '../store';
import { useCurrentUser } from '../useCurrentUser';

const user: User = {
  userId: 'u1',
  email: 'trainer@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  roles: [UserRole.Trainer],
};

describe('useCurrentUser', () => {
  afterEach(() => {
    act(() => {
      useUserStore.setState({ user: null });
    });
  });

  it('returns null when no user is hydrated', () => {
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toBeNull();
  });

  it('returns the hydrated user from the store', () => {
    act(() => {
      useUserStore.setState({ user });
    });
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toEqual(user);
  });

  it('reflects subsequent store updates', () => {
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toBeNull();

    act(() => {
      useUserStore.getState().setUser(user);
    });

    expect(result.current).toEqual(user);

    act(() => {
      useUserStore.getState().clearUser();
    });

    expect(result.current).toBeNull();
  });
});
