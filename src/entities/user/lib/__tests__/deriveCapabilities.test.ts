import { PlanCode, SubscriptionSource, type PlanPermissions, type Subscription } from '@/src/shared/types';

import { UserRole, type User } from '../../model/types';
import { deriveCapabilities } from '../deriveCapabilities';
import { isAdmin, isTrainer } from '../roles';

const buildPermissions = (overrides: Partial<PlanPermissions> = {}): PlanPermissions => ({
  canCreateExercise: false,
  canEditExercises: false,
  canCreateProgram: false,
  canEditPrograms: false,
  canCreateInvite: false,
  canManageClients: false,
  ...overrides,
});

const buildSubscription = (permissions: PlanPermissions): Subscription => ({
  plan: PlanCode.Free,
  source: SubscriptionSource.Admin,
  validUntil: null,
  limits: { exercises: 10, activePrograms: 3, activeClients: 3 },
  usage: { exercises: 0, activePrograms: 0, activeClients: 0 },
  permissions,
});

const buildUser = (overrides: Partial<User> = {}): User => ({
  userId: 'user-1',
  email: 'coach@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  roles: [UserRole.Trainer],
  ...overrides,
});

describe('role guards', () => {
  it('detects admin and trainer roles', () => {
    expect(isAdmin([UserRole.Admin])).toBe(true);
    expect(isAdmin([UserRole.Trainer])).toBe(false);
    expect(isTrainer([UserRole.Trainer])).toBe(true);
    expect(isTrainer([UserRole.Client])).toBe(false);
  });
});

describe('deriveCapabilities', () => {
  it('returns no capabilities for a null user', () => {
    expect(deriveCapabilities(null)).toEqual({
      isAdmin: false,
      isTrainer: false,
      canCreateExercise: false,
      canCreateProgram: false,
      canCreateInvite: false,
      canViewClients: false,
      canManageClients: false,
    });
  });

  it('lets admins own the global catalog but stay read-only elsewhere', () => {
    const caps = deriveCapabilities(buildUser({ roles: [UserRole.Admin], subscription: null }));

    expect(caps.isAdmin).toBe(true);
    expect(caps.canCreateExercise).toBe(true);
    expect(caps.canViewClients).toBe(true);
    expect(caps.canCreateProgram).toBe(false);
    expect(caps.canCreateInvite).toBe(false);
    expect(caps.canManageClients).toBe(false);
  });

  it('drives trainer capabilities from plan permissions', () => {
    const permissions = buildPermissions({ canCreateProgram: true, canManageClients: true });
    const caps = deriveCapabilities(buildUser({ subscription: buildSubscription(permissions) }));

    expect(caps.isTrainer).toBe(true);
    expect(caps.canCreateProgram).toBe(true);
    expect(caps.canManageClients).toBe(true);
    expect(caps.canCreateExercise).toBe(false);
    expect(caps.canViewClients).toBe(true);
  });

  it('denies trainer create actions when subscription is missing', () => {
    const caps = deriveCapabilities(buildUser({ subscription: null }));

    expect(caps.canCreateExercise).toBe(false);
    expect(caps.canCreateProgram).toBe(false);
    expect(caps.canCreateInvite).toBe(false);
    expect(caps.canManageClients).toBe(false);
  });
});
