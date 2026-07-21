import type { AnalyticsPagination, AnalyticsProgramStatus } from './analytics.types';

/**
 * Trainer analytics DTOs for programs. Body keys are camelCase (converted by the
 * BFF proxy); query params are built by hand in `buildProgramsAnalyticsQuery`.
 */

export type ProgramAnalyticsSortField = 'name' | 'lastActivity';

export type ProgramAnalyticsSortOrder = 'asc' | 'desc';

export type FetchProgramsAnalyticsParams = {
  /** Free-text search; sent as `q` (backend support pending, harmless until then). */
  name?: string;
  sortBy?: ProgramAnalyticsSortField;
  sortOrder?: ProgramAnalyticsSortOrder;
};

/** One row in the programs analytics list (GET /trainer/programs/analytics). */
export type ProgramAnalyticsItem = {
  programId: string;
  name: string;
  nameRu: string;
  status: AnalyticsProgramStatus;
  trainingDaysCount: number;
  activeClientsCount: number;
  /** Lifetime completions across all versions and cycles. */
  totalCompletions: number;
  completionsLast30Days: number;
  /** Average current-cycle percent of active assignees; null when none. */
  avgCompletionPercent: number | null;
  lastActivityAt: string | null;
};

export type ProgramsAnalyticsResult = {
  items: ProgramAnalyticsItem[];
  pagination: AnalyticsPagination;
};

/** Header block of the program analytics detail. */
export type ProgramAnalyticsHeader = {
  programId: string;
  name: string;
  nameRu: string;
  status: AnalyticsProgramStatus;
  /** 0 when the program has never been published. */
  latestVersionNumber: number;
  trainingDaysCount: number;
};

/** Aggregate summary shared with the list row. */
export type ProgramAnalyticsSummary = {
  activeClientsCount: number;
  totalCompletions: number;
  completionsLast30Days: number;
  avgCompletionPercent: number | null;
  lastActivityAt: string | null;
};

/** One active assignee's current-cycle progress. */
export type ProgramAnalyticsClient = {
  clientUserId: string;
  displayName: string;
  avatarUrl: string;
  assignedAt: string;
  isBehindLatest: boolean;
  completedDays: number;
  totalTrainingDays: number;
  completionPercent: number;
  lastCompletedAt: string | null;
};

/** Current-cycle completions grouped by program week (drop-off). */
export type ProgramAnalyticsWeek = {
  weekNumber: number;
  completionsCount: number;
  distinctClientsCount: number;
};

/** Full payload for GET /trainer/programs/{id}/analytics. */
export type ProgramAnalytics = {
  program: ProgramAnalyticsHeader;
  summary: ProgramAnalyticsSummary;
  clients: ProgramAnalyticsClient[];
  weeks: ProgramAnalyticsWeek[];
};
