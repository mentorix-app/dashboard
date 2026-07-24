import type { ViewMode } from '@/src/features/ViewModeSwitch';

export type WeekResultsParamUpdates = {
  week?: number;
  view?: ViewMode;
  day?: number;
};

export type WeekOption = {
  value: number;
  label: string;
};

export type WeekResultsCommentVM = {
  id: string;
  text: string;
  createdAtLabel: string;
};

export type WeekResultsCellVM = {
  dayNumber: number;
  isSubmitted: boolean;
  /** Completion the trainer can reply to; null when the client has no result. */
  completionId: string | null;
  resultText: string;
  completedAtLabel: string | null;
  comments: WeekResultsCommentVM[];
};

export type WeekResultsClientVM = {
  clientUserId: string;
  displayName: string;
  avatarSrc: string | undefined;
  avatarAlt: string;
  initials: string;
  isBehindLatest: boolean;
  progressLabel: string;
  completionPercent: number;
  href: string;
  /** One cell per training day, aligned to `dayNumbers`. */
  cells: WeekResultsCellVM[];
};

export type WeekResultsSummaryVM = {
  completionPercent: number;
  completionLabel: string;
  submittedValue: number;
  missingValue: number;
  behindValue: number;
};
