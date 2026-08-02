import { act, renderHook } from '@testing-library/react';

import { PlanCode, SubscriptionSource } from '@/src/shared/types';
import type { Subscription } from '@/src/shared/types';
import type { User } from '../types';
import { UserRole } from '../types';
import { useUserStore } from '../store';
import { useSubscription } from '../useSubscription';

const subscription: Subscription = {
  plan: PlanCode.Advance,
  source: SubscriptionSource.Admin,
  validUntil: '2025-01-01T00:00:00.000Z',
  limits: { exercises: null, activePrograms: 10, activeClients: 10 },
  usage: { exercises: 3, activePrograms: 1, activeClients: 2 },
  permissions: {
    canCreateExercise: true,
    canEditExercises: true,
    canCreateProgram: true,
    canEditPrograms: true,
    canCreateInvite: true,
    canManageClients: true,
  },
};

const trainerWithSubscription: User = {
  userId: 'u1',
  email: 'trainer@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  roles: [UserRole.Trainer],
  subscription,
};

const adminWithoutSubscription: User = {
  userId: 'u2',
  email: 'admin@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  roles: [UserRole.Admin],
  subscription: null,
};

describe('useSubscription', () => {
  afterEach(() => {
    act(() => {
      useUserStore.setState({ user: null });
    });
  });

  it('returns null when there is no hydrated user', () => {
    const { result } = renderHook(() => useSubscription());

    expect(result.current).toBeNull();
  });

  it("returns null when the user's subscription is null (e.g. admin)", () => {
    act(() => {
      useUserStore.setState({ user: adminWithoutSubscription });
    });
    const { result } = renderHook(() => useSubscription());

    expect(result.current).toBeNull();
  });

  it('returns the subscription from the hydrated user', () => {
    act(() => {
      useUserStore.setState({ user: trainerWithSubscription });
    });
    const { result } = renderHook(() => useSubscription());

    expect(result.current).toEqual(subscription);
  });
});
