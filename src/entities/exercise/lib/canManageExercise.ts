import type { Exercise } from '../model/types';
import { ExerciseScope } from '../model/types';

export type ExerciseManageContext = {
  isAdmin: boolean;
  isTrainer: boolean;
  userId?: string;
};

/**
 * Row-level edit/delete permission for a single exercise. This is deliberately
 * separate from the global `canCreateExercise` capability: creation is a plan
 * gate, whereas managing an existing row depends on its scope and ownership.
 * - Admins own the shared global catalog.
 * - Trainers manage only their own private exercises; global exercises are
 *   visible but read-only for them.
 */
export const canManageExercise = (exercise: Exercise, ctx: ExerciseManageContext): boolean => {
  if (ctx.isAdmin) return exercise.scope === ExerciseScope.Global;
  if (ctx.isTrainer) {
    return exercise.scope === ExerciseScope.Private && !!ctx.userId && exercise.ownerUserId === ctx.userId;
  }
  return false;
};
