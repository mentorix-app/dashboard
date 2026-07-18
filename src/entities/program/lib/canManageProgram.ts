import type { Program } from '../model/types';

export type ProgramManageContext = {
  isTrainer: boolean;
  userId?: string;
};

/**
 * Whether the current user may manage (edit, publish, archive, sync) a program.
 * Roles are mutually exclusive and admins are read-only for programs, so only
 * the owning trainer qualifies.
 */
export const canManageProgram = (program: Program, ctx: ProgramManageContext): boolean =>
  ctx.isTrainer && !!ctx.userId && program.createdBy === ctx.userId;
