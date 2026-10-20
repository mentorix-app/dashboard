import { UserRole } from '../../model/types';
import { isAdmin, isTrainer, needsTrainerActivation } from '../roles';

describe('roles', () => {
  it('detects an administrator and a trainer', () => {
    expect(isAdmin([UserRole.Admin])).toBe(true);
    expect(isAdmin([UserRole.Client, UserRole.Trainer])).toBe(false);
    expect(isTrainer([UserRole.Client, UserRole.Trainer])).toBe(true);
    expect(isTrainer([UserRole.Client])).toBe(false);
  });
});

describe('needsTrainerActivation', () => {
  it('is true for an account that is only a client', () => {
    expect(needsTrainerActivation([UserRole.Client])).toBe(true);
  });

  it('is true for an account without any role yet', () => {
    expect(needsTrainerActivation([])).toBe(true);
  });

  it('is false for a trainer, with or without the client role', () => {
    expect(needsTrainerActivation([UserRole.Trainer])).toBe(false);
    expect(needsTrainerActivation([UserRole.Client, UserRole.Trainer])).toBe(false);
  });

  it('is false for an administrator, whom the API refuses to activate', () => {
    expect(needsTrainerActivation([UserRole.Admin])).toBe(false);
  });
});
