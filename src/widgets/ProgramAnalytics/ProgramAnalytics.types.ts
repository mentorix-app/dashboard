export type ProgramAnalyticsSummaryVM = {
  activeClients: number;
  totalCompletions: number;
  completionsLast30Days: number;
  avgCompletionLabel: string;
  behindLatestCount: number;
};

export type WeeklyDropOffPoint = {
  week: string;
  completions: number;
  distinctClients: number;
};

export type ProgramAnalyticsClientVM = {
  clientUserId: string;
  displayName: string;
  avatarSrc: string | undefined;
  avatarAlt: string;
  initials: string;
  assignedLabel: string;
  completionPercent: number;
  daysLabel: string;
  isBehindLatest: boolean;
  versionLabel: string;
  lastCompletedLabel: string;
  /** Raw timestamp for sorting; null when the client has never completed a day. */
  lastCompletedAt: string | null;
  href: string;
};

export type ActiveClientsSortField = 'progress' | 'lastCompleted';

export type ActiveClientsSortOrder = 'asc' | 'desc';
