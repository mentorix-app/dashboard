/**
 * Client training-result model. These types describe a client's submitted
 * workout results for an assigned program, grouped week → day. They are a
 * denormalized snapshot (a frozen program version plus the client's result for
 * each day), independent of the editable Program tree, so the client entity
 * stays self-contained.
 */

/** Result state of a single training day, used for at-a-glance status. */
export enum TrainingDayStatus {
  /** Client submitted a result the trainer has not reviewed yet. */
  New = 'new',
  /** No result submitted yet for a day that expects one. */
  NoResult = 'no_result',
  /** Trainer flagged the day as needing follow-up. */
  NeedsAttention = 'needs_attention',
  /** Trainer reviewed the submitted result. */
  Reviewed = 'reviewed',
  /** Rest day — no result expected. */
  NotRequired = 'not_required',
}

/** How a single exercise was performed relative to the plan. */
export enum ExerciseCompletion {
  CompletedAsPlanned = 'completed_as_planned',
  Modified = 'modified',
  Skipped = 'skipped',
}

export type TrainingExerciseResult = {
  id: string;
  name: string;
  nameRu: string;
  /** Planned volume text (e.g. "3 × 8"), or null when unset. */
  planned: string | null;
  /** What the client actually did (e.g. "3 × 6 @ lighter"), or null. */
  actual: string | null;
  completion: ExerciseCompletion;
};

export type TrainingBlockResult = {
  id: string;
  title: string;
  titleRu: string;
  completed: boolean;
};

export type TrainingDayResult = {
  id: string;
  dayNumber: number;
  title: string;
  titleRu: string;
  status: TrainingDayStatus;
  /** ISO timestamp of when the client submitted, or null when no result. */
  receivedAt: string | null;
  /** Free-form note the client left with the submission, or null. */
  clientFeedback: string | null;
  /** Private coach note attached to the day, or null when none. */
  coachNote: string | null;
  blocks: TrainingBlockResult[];
  exercises: TrainingExerciseResult[];
};

export type TrainingWeekResult = {
  weekNumber: number;
  days: TrainingDayResult[];
};

/** Lifecycle of a program assigned to a client. */
export enum TrainingProgramStatus {
  Active = 'active',
  Completed = 'completed',
}

export type TrainingProgramResult = {
  assignmentId: string;
  programId: string;
  programName: string;
  programNameRu: string;
  status: TrainingProgramStatus;
  assignedAt: string;
  weeks: TrainingWeekResult[];
};

/** Left-column header details for a client profile. */
export type ClientProfileHeader = {
  clientUserId: string;
  displayName: string;
  username: string | null;
  avatarUrl: string;
  isActive: boolean;
  coachName: string;
  linkedAt: string;
  currentProgramName: string;
};

export type ClientProfile = {
  header: ClientProfileHeader;
  programs: TrainingProgramResult[];
};
