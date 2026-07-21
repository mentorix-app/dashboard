import type { AnalyticsClientStatus, AnalyticsPagination } from './analytics.types';

/**
 * Trainer analytics DTOs for a single client. The BFF proxy converts response
 * body keys snake_case → camelCase, so these mirror the OpenAPI schemas with
 * camelCase names. Query params are NOT converted — see `buildCompletionsQuery`.
 */

/** Client card shown in the analytics header/sidebar. */
export type AnalyticsClientInfo = {
  clientUserId: string;
  displayName: string;
  /** Signed avatar proxy URL or empty string. Resolve with `getClientAvatarSrc`. */
  avatarUrl: string;
  status: AnalyticsClientStatus;
  linkedAt: string;
  lastActiveAt: string | null;
};

/** Per-week completed-vs-total breakdown of the assigned frozen version. */
export type AnalyticsWeekProgress = {
  weekNumber: number;
  totalDays: number;
  completedDays: number;
};

/** Current completion cycle vs the assigned frozen version. */
export type AnalyticsProgress = {
  completedDays: number;
  /** Days with at least one block in the assigned version. */
  totalTrainingDays: number;
  /** 0–100, one decimal, clamped at 100. */
  completionPercent: number;
  weeks: AnalyticsWeekProgress[];
};

/** The client's current program assignment plus its progress. */
export type AnalyticsAssignment = {
  programId: string;
  programVersionId: string;
  programName: string;
  programNameRu: string;
  assignedAt: string;
  /** True when the client's frozen version is behind the program's latest. */
  isBehindLatest: boolean;
  progress: AnalyticsProgress;
};

/** Lifetime completion totals for one program the client has trained. */
export type AnalyticsProgramActivity = {
  /** Null when the program row was deleted (name from journal snapshot). */
  programId: string | null;
  programName: string;
  programNameRu: string;
  totalCompletions: number;
  firstCompletedAt: string;
  lastCompletedAt: string;
};

/** Lifetime activity with this trainer, across all cycles and programs. */
export type AnalyticsActivity = {
  totalCompletions: number;
  completionsLast7Days: number;
  completionsLast30Days: number;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  /** Consecutive Mon–Sun (UTC) weeks with at least one completion. */
  weekStreak: number;
  byProgram: AnalyticsProgramActivity[];
};

/** Full analytics payload for GET /trainer/clients/{id}/analytics. */
export type ClientAnalytics = {
  client: AnalyticsClientInfo;
  /** Null when the client has no active program assignment. */
  currentAssignment: AnalyticsAssignment | null;
  activity: AnalyticsActivity;
};

/** One completed workout day in the client's history feed. */
export type ClientCompletionItem = {
  id: string;
  completedAt: string;
  programId: string | null;
  programName: string;
  programNameRu: string;
  weekNumber: number;
  dayNumber: number;
  /** Client's free-text workout result from Telegram. */
  resultText: string;
  /** True when the completion belongs to the current assignment cycle. */
  isCurrentCycle: boolean;
};

/** Paginated response for GET /trainer/clients/{id}/completions. */
export type ClientCompletionsResult = {
  items: ClientCompletionItem[];
  pagination: AnalyticsPagination;
};

/** Optional date-range filter for the completions feed (`to` is exclusive). */
export type ClientCompletionsParams = {
  /** RFC3339 or YYYY-MM-DD; only completions at or after this time. */
  from?: string;
  /** RFC3339 or YYYY-MM-DD; only completions before this time (exclusive). */
  to?: string;
};
