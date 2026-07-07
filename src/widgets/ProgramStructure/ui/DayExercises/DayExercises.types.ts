import type { ProgramDay, ProgramWeek } from '@/src/entities/program';

export type DayExercisesProps = {
  programId: string;
  weekId: string;
  /** The currently selected day whose exercises are edited. */
  day: ProgramDay;
  /** The parent week — needed for cross-day moves and week-scoped reordering. */
  week: ProgramWeek;
  /** False for archived programs: everything becomes read-only. */
  canEdit: boolean;
};

/** A move-target option shown in a row's actions menu. */
export type MoveTargetDay = {
  id: string;
  label: string;
};

/** A group block an exercise can be moved into, labeled by its block type. */
export type BlockMoveTarget = {
  id: string;
  label: string;
};
