/**
 * Trainer week-results matrix DTOs (GET /trainer/programs/{id}/weeks/{n}/results).
 * Body keys are camelCase (converted by the BFF proxy).
 */

/** Whether a client submitted a result for a given training day. */
export type ProgramWeekCellStatus = 'submitted' | 'no_result';

/** A trainer reply attached to a workout completion (oldest first). */
export type ProgramWeekMatrixComment = {
  id: string;
  text: string;
  createdAt: string;
};

/** One client × day cell in the week matrix. */
export type ProgramWeekMatrixCell = {
  status: ProgramWeekCellStatus;
  /** Null when the client has no result for this day. */
  completionId: string | null;
  /** Client's free-text workout result; empty string when no result. */
  resultText: string;
  /** Null when the client has no result for this day. */
  completedAt: string | null;
  comments: ProgramWeekMatrixComment[];
};

/** A training day column for the selected week (rest/empty days excluded). */
export type ProgramWeekDayColumn = {
  dayNumber: number;
};

/** One active assignee row, with a cell per training day (aligned to `days`). */
export type ProgramWeekMatrixClient = {
  clientUserId: string;
  displayName: string;
  avatarUrl: string;
  isBehindLatest: boolean;
  completedDays: number;
  totalDays: number;
  days: ProgramWeekMatrixCell[];
};

/** Aggregate totals for the selected week. */
export type ProgramWeekMatrixSummary = {
  totalTrainingSlots: number;
  submittedCount: number;
  missingCount: number;
  /** 0–100. */
  completionPercent: number;
  behindClientsCount: number;
};

/** Full payload for GET /trainer/programs/{id}/weeks/{n}/results. */
export type ProgramWeekResults = {
  days: ProgramWeekDayColumn[];
  clients: ProgramWeekMatrixClient[];
  summary: ProgramWeekMatrixSummary;
};
