import type { AnalyticsProgress, ClientCompletionItem } from '@/src/entities/analytics';
import { dateKey, toDateKey } from '@/src/shared/lib';

import type {
  CalendarCell,
  CalendarMonth,
  CompletionReviewStatus,
  TrainingStatusCounts,
  WeeklyChartPoint,
} from './ClientTraining.types';

/** Pick a localized string; analytics store English + Russian side by side. */
export const pickText = (locale: string, en: string, ru: string): string => (locale === 'ru' ? ru : en);

/**
 * A completion is "reviewed" once the trainer has replied to it; otherwise it
 * still "needs attention". Drives the history feed labels and calendar dots.
 */
export const getReviewStatus = (completion: ClientCompletionItem): CompletionReviewStatus =>
  completion.comments.length > 0 ? 'reviewed' : 'needsAttention';

/**
 * Split the current assignment's completed days into "reviewed" (the trainer
 * has replied) and "needs attention" (awaiting a reply). `reviewed` is counted
 * from the loaded feed's current-cycle comments, so it updates as soon as a
 * trainer replies; `needsAttention` is the authoritative completed-day total
 * minus that. `noResult` is training days without any completion.
 */
export const buildStatusCounts = (
  progress: AnalyticsProgress,
  completions: ClientCompletionItem[]
): TrainingStatusCounts => {
  const reviewed = completions.filter(
    (completion) => completion.isCurrentCycle && completion.comments.length > 0
  ).length;

  return {
    reviewed,
    needsAttention: Math.max(progress.completedDays - reviewed, 0),
    noResult: Math.max(progress.totalTrainingDays - progress.completedDays, 0),
  };
};

/** Per-week completed-vs-total points for the overview bar chart. */
export const buildWeeklyChart = (progress: AnalyticsProgress): WeeklyChartPoint[] =>
  progress.weeks.map((week) => ({
    weekNumber: week.weekNumber,
    completed: week.completedDays,
    total: week.totalDays,
  }));

/** Inclusive `from` / exclusive `to` date bounds for a calendar month. */
export const monthRange = (month: CalendarMonth): { from: string; to: string } => {
  const firstOfNext = new Date(month.year, month.month + 1, 1);
  return {
    from: dateKey(month.year, month.month, 1),
    to: dateKey(firstOfNext.getFullYear(), firstOfNext.getMonth(), firstOfNext.getDate()),
  };
};

/** Move a calendar month by a number of months (handles year rollover). */
export const shiftMonth = (month: CalendarMonth, delta: number): CalendarMonth => {
  const shifted = new Date(month.year, month.month + delta, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() };
};

/** The current calendar month in the viewer's local time. */
export const currentMonth = (): CalendarMonth => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
};

/**
 * Build a Monday-first month grid, padded with blanks. Each day cell carries all
 * completions recorded on that date (the feed is newest-first, so is each group).
 */
export const buildCalendarCells = (month: CalendarMonth, completions: ClientCompletionItem[]): CalendarCell[] => {
  const byDate = new Map<string, ClientCompletionItem[]>();
  for (const item of completions) {
    const key = toDateKey(item.completedAt);
    const existing = byDate.get(key);
    if (existing) existing.push(item);
    else byDate.set(key, [item]);
  }

  const firstOfMonth = new Date(month.year, month.month, 1);
  // getDay(): 0=Sun..6=Sat → Monday-first index 0=Mon..6=Sun.
  const leading = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < leading; i += 1) cells.push({ day: null, completions: [] });
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, completions: byDate.get(dateKey(month.year, month.month, day)) ?? [] });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, completions: [] });

  return cells;
};
