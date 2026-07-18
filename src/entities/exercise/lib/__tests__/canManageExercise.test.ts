import { Difficulty } from '@/src/shared/types';

import { ExerciseMuscleGroup, ExerciseScope, ExerciseType, type Exercise } from '../../model/types';
import { canManageExercise } from '../canManageExercise';

const buildExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: 'exercise-1',
  name: 'Back Squat',
  nameRu: 'Присед',
  addedBy: 'user-1',
  modifiedBy: 'user-1',
  modifiedAt: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  type: ExerciseType.Strength,
  muscleGroup: ExerciseMuscleGroup.Legs,
  description: 'desc',
  descriptionRu: 'описание',
  difficulty: Difficulty.Intermediate,
  videoUrl: '',
  previewImageUrl: '',
  scope: ExerciseScope.Global,
  ownerUserId: null,
  ...overrides,
});

describe('canManageExercise', () => {
  it('lets admins manage only global exercises', () => {
    const global = buildExercise({ scope: ExerciseScope.Global });
    const priv = buildExercise({ scope: ExerciseScope.Private, ownerUserId: 'user-2' });

    expect(canManageExercise(global, { isAdmin: true, isTrainer: false })).toBe(true);
    expect(canManageExercise(priv, { isAdmin: true, isTrainer: false })).toBe(false);
  });

  it('lets trainers manage only their own private exercises', () => {
    const owned = buildExercise({ scope: ExerciseScope.Private, ownerUserId: 'user-1' });
    const others = buildExercise({ scope: ExerciseScope.Private, ownerUserId: 'user-2' });
    const global = buildExercise({ scope: ExerciseScope.Global });

    expect(canManageExercise(owned, { isAdmin: false, isTrainer: true, userId: 'user-1' })).toBe(true);
    expect(canManageExercise(others, { isAdmin: false, isTrainer: true, userId: 'user-1' })).toBe(false);
    expect(canManageExercise(global, { isAdmin: false, isTrainer: true, userId: 'user-1' })).toBe(false);
  });

  it('denies management without a role', () => {
    const exercise = buildExercise({ scope: ExerciseScope.Private, ownerUserId: 'user-1' });
    expect(canManageExercise(exercise, { isAdmin: false, isTrainer: false, userId: 'user-1' })).toBe(false);
  });
});
