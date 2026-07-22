import type { ReviewStatusKey } from './ClientTraining.types';

/**
 * Presentation metadata for the three review buckets. `reviewed` marks
 * completions the trainer has replied to; `needsAttention` still awaits a
 * reply. Colours are paired with text (WCAG, not colour-only).
 */
export const REVIEW_STATUS_META: Record<ReviewStatusKey, { dot: string; text: string }> = {
  needsAttention: { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  reviewed: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  noResult: { dot: 'bg-muted-foreground/40', text: 'text-muted-foreground' },
};

/** Fixed display order for the status counts / legend. */
export const REVIEW_STATUS_ORDER: ReviewStatusKey[] = ['needsAttention', 'reviewed', 'noResult'];
