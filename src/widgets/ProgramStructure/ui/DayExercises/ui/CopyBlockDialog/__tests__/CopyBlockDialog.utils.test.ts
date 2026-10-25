import { EMPTY_BLOCK_SETTINGS } from '@/src/entities/program/model/blockSettings';
import {
  ProgramBlockType,
  type ProgramDay,
  type ProgramDayBlock,
  type ProgramWeek,
} from '@/src/entities/program/model/structure';

import { buildCopyTargets, needsSharedBlockWarning, summarizeNames } from '../CopyBlockDialog.utils';

const buildBlock = (id: string, clientUserIds: string[] = []): ProgramDayBlock => ({
  id,
  blockType: ProgramBlockType.Emom,
  instruction: '',
  sortOrder: 1,
  clientUserIds,
  exercises: [],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
});

const buildDay = (id: string, dayNumber: number, blocks: ProgramDayBlock[]): ProgramDay => ({
  id,
  dayNumber,
  sortOrder: dayNumber,
  blocks,
  createdAt: '2026-10-25T00:00:00Z',
});

const buildWeek = (id: string, weekNumber: number, days: ProgramDay[]): ProgramWeek => ({
  id,
  weekNumber,
  sortOrder: weekNumber,
  days,
  createdAt: '2026-10-25T00:00:00Z',
});

const weeks = [
  buildWeek('w1', 1, [buildDay('d1', 1, [buildBlock('b1')]), buildDay('d2', 2, [])]),
  buildWeek('w2', 2, [buildDay('d3', 1, [buildBlock('b2', ['client-1'])])]),
];

describe('buildCopyTargets', () => {
  it('lists every day of every week and marks the source', () => {
    expect(buildCopyTargets(weeks, 'w1', 'd1')).toEqual([
      {
        id: 'w1',
        weekNumber: 1,
        isSource: true,
        days: [
          { id: 'd1', dayNumber: 1, blockCount: 1, hasSharedBlock: true, isSource: true },
          { id: 'd2', dayNumber: 2, blockCount: 0, hasSharedBlock: false, isSource: false },
        ],
      },
      {
        id: 'w2',
        weekNumber: 2,
        isSource: false,
        days: [{ id: 'd3', dayNumber: 1, blockCount: 1, hasSharedBlock: false, isSource: false }],
      },
    ]);
  });
});

describe('needsSharedBlockWarning', () => {
  const [week1, week2] = buildCopyTargets(weeks, 'w1', 'd1');
  const [sourceDay, restDay] = week1?.days ?? [];
  const restrictedDay = week2?.days[0] ?? null;

  it('warns only when a restricted copy lands in a day without a shared block', () => {
    const restricted = buildBlock('x', ['client-1']);
    expect(needsSharedBlockWarning(restricted, restDay ?? null)).toBe(true);
    expect(needsSharedBlockWarning(restricted, restrictedDay)).toBe(true);
    expect(needsSharedBlockWarning(restricted, sourceDay ?? null)).toBe(false);
    expect(needsSharedBlockWarning(restricted, null)).toBe(false);
  });

  it('never warns for a shared block', () => {
    expect(needsSharedBlockWarning(buildBlock('x'), restDay ?? null)).toBe(false);
  });
});

describe('summarizeNames', () => {
  it('keeps the first names and counts the rest', () => {
    expect(summarizeNames(['a', 'b'])).toEqual({ shown: ['a', 'b'], hiddenCount: 0 });
    expect(summarizeNames(['a', 'b', 'c', 'd', 'e'])).toEqual({ shown: ['a', 'b', 'c'], hiddenCount: 2 });
  });
});
