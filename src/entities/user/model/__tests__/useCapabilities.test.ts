import { act, renderHook } from '@testing-library/react';

import type { User } from '../types';
import { UserRole } from '../types';
import { useUserStore } from '../store';

jest.mock('../../lib/deriveCapabilities', () => ({
  deriveCapabilities: jest.fn(() => ({ marker: 'derived' })),
}));

import { deriveCapabilities } from '../../lib/deriveCapabilities';
import { useCapabilities } from '../useCapabilities';

const mockedDerive = deriveCapabilities as jest.Mock;

const user: User = {
  userId: 'u1',
  email: 'trainer@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  roles: [UserRole.Trainer],
};

describe('useCapabilities', () => {
  beforeEach(() => {
    mockedDerive.mockClear();
  });

  afterEach(() => {
    act(() => {
      useUserStore.setState({ user: null });
    });
  });

  it('derives capabilities from the current user', () => {
    act(() => {
      useUserStore.setState({ user });
    });
    const { result } = renderHook(() => useCapabilities());

    expect(mockedDerive).toHaveBeenCalledWith(user);
    expect(result.current).toEqual({ marker: 'derived' });
  });

  it('memoizes and does not recompute across rerenders while the user reference is unchanged', () => {
    act(() => {
      useUserStore.setState({ user });
    });
    const { rerender } = renderHook(() => useCapabilities());

    expect(mockedDerive).toHaveBeenCalledTimes(1);

    rerender();

    expect(mockedDerive).toHaveBeenCalledTimes(1);
  });

  it('recomputes when the user changes', () => {
    act(() => {
      useUserStore.setState({ user });
    });
    const { rerender } = renderHook(() => useCapabilities());

    expect(mockedDerive).toHaveBeenCalledTimes(1);

    const otherUser: User = { ...user, userId: 'u2' };
    act(() => {
      useUserStore.setState({ user: otherUser });
    });
    rerender();

    expect(mockedDerive).toHaveBeenCalledTimes(2);
    expect(mockedDerive).toHaveBeenLastCalledWith(otherUser);
  });
});
