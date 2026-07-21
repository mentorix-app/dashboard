import type {
  FetchProgramsAnalyticsParams,
  ProgramAnalyticsSortField,
  ProgramAnalyticsSortOrder,
} from '@/src/entities/analytics';
import type { ProgramStatus } from '@/src/entities/program';

export type ProgramsAnalyticsSearchParamUpdates = {
  name?: string;
  sortBy?: ProgramAnalyticsSortField;
  sortOrder?: ProgramAnalyticsSortOrder;
};

export type ProgramsAnalyticsListState = {
  name?: string;
  sortBy: ProgramAnalyticsSortField;
  sortOrder: ProgramAnalyticsSortOrder;
};

export type ProgramsAnalyticsSearchController = {
  search: string;
  listParams: FetchProgramsAnalyticsParams;
  sortBy: ProgramAnalyticsSortField;
  sortOrder: ProgramAnalyticsSortOrder;
  handleSearchChange: (value: string) => void;
  handleSortByChange: (sortBy: ProgramAnalyticsSortField) => void;
  handleSortOrderChange: (order: ProgramAnalyticsSortOrder) => void;
};

/** Ready-to-render card model built in the config hook. */
export type ProgramAnalyticsCardVM = {
  programId: string;
  name: string;
  status: ProgramStatus;
  statusLabel: string;
  /** Detail link; null for drafts (no client results to show). */
  href: string | null;
  activeClients: number;
  totalCompletions: number;
  completionsLast30Days: number;
  /** Formatted percent (e.g. "68%") or the em dash when there are no active clients. */
  avgCompletionLabel: string;
  /** Raw percent for the progress bar; null when unavailable. */
  avgCompletionPercent: number | null;
  lastActivityLabel: string;
};
