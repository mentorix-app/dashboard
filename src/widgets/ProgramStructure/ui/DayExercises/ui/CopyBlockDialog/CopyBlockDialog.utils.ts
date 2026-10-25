import type { ProgramDayBlock, ProgramWeek } from '@/src/entities/program';

import type { CopyTargetDay, CopyTargetWeek } from './CopyBlockDialog.types';

/** Every existing day of every week of the program is a copy target, the source day included. */
export const buildCopyTargets = (weeks: ProgramWeek[], sourceWeekId: string, sourceDayId: string): CopyTargetWeek[] =>
  weeks.map((week) => ({
    id: week.id,
    weekNumber: week.weekNumber,
    isSource: week.id === sourceWeekId,
    days: week.days.map((day) => ({
      id: day.id,
      dayNumber: day.dayNumber,
      blockCount: day.blocks.length,
      hasSharedBlock: day.blocks.some((block) => block.clientUserIds.length === 0),
      isSource: day.id === sourceDayId,
    })),
  }));

/**
 * A copy keeps the source's client list, so a restricted copy landing in a day
 * without a shared block would make publishing fail. The copy is still allowed;
 * the dialog just warns.
 */
export const needsSharedBlockWarning = (block: ProgramDayBlock, day: CopyTargetDay | null): boolean =>
  block.clientUserIds.length > 0 && day !== null && !day.hasSharedBlock;

/** First `limit` names plus how many are left out, for a compact one-line preview. */
export const summarizeNames = (names: string[], limit = 3) => ({
  shown: names.slice(0, limit),
  hiddenCount: Math.max(0, names.length - limit),
});
