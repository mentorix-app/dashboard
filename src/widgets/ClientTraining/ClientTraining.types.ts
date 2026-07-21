import type { ClientAnalytics, ClientCompletionItem } from '@/src/entities/analytics';

export type ClientTrainingProps = {
  clientUserId: string;
};

export type ClientTrainingViewMode = 'list' | 'calendar';

/** One review-status bucket driving the overview counts and legend. */
export type ReviewStatusKey = 'needsAttention' | 'reviewed' | 'noResult';

/** Per-completion review state shown as a label in the history feed. */
export type CompletionReviewStatus = 'needsAttention' | 'reviewed';

export type TrainingStatusCounts = Record<ReviewStatusKey, number>;

export type WeeklyChartPoint = {
  weekNumber: number;
  completed: number;
  total: number;
};

/** Zero-indexed month (`month` 0–11) shown by the calendar navigator. */
export type CalendarMonth = {
  year: number;
  month: number;
};

export type CalendarCell = {
  /** Null for leading/trailing blanks that pad the month grid. */
  day: number | null;
  /** Completions recorded on this date (newest first); a day may have several. */
  completions: ClientCompletionItem[];
};

/** Everything the training widget's UI needs, produced by `useClientTrainingConfig`. */
export type ClientTrainingConfig = {
  locale: string;
  isLoading: boolean;
  isError: boolean;
  analytics: ClientAnalytics | null;
  statusCounts: TrainingStatusCounts | null;
  weeklyChart: WeeklyChartPoint[];
  viewMode: ClientTrainingViewMode;
  onViewModeChange: (mode: ClientTrainingViewMode) => void;
  selected: ClientCompletionItem | null;
  onSelect: (completion: ClientCompletionItem) => void;
  // List (infinite feed across all programs).
  completions: ClientCompletionItem[];
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  // Calendar (single month).
  month: CalendarMonth;
  monthCells: CalendarCell[];
  isMonthLoading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};
