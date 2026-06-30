import type { ProgramWeek } from '@/src/entities/program';

import { buildLocalWeek, reorderWeeks } from '../ProgramStructure.utils';

const buildWeek = (overrides: Partial<ProgramWeek> = {}): ProgramWeek => ({
  id: 'week-1',
  weekNumber: 1,
  sortOrder: 1,
  days: [],
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('ProgramStructure utils', () => {
  describe('buildLocalWeek', () => {
    it('appends the next week number with no days', () => {
      const weeks = [buildWeek({ id: 'a' }), buildWeek({ id: 'b', weekNumber: 2, sortOrder: 2 })];

      const week = buildLocalWeek(weeks);

      expect(week.weekNumber).toBe(3);
      expect(week.sortOrder).toBe(3);
      expect(week.days).toEqual([]);
      expect(week.id).toEqual(expect.any(String));
    });

    it('numbers the first week as 1', () => {
      expect(buildLocalWeek([]).weekNumber).toBe(1);
    });
  });

  describe('reorderWeeks', () => {
    it('reorders weeks to match the id order and renumbers them', () => {
      const weeks = [
        buildWeek({ id: 'a', weekNumber: 1, sortOrder: 1 }),
        buildWeek({ id: 'b', weekNumber: 2, sortOrder: 2 }),
        buildWeek({ id: 'c', weekNumber: 3, sortOrder: 3 }),
      ];

      const result = reorderWeeks(weeks, ['c', 'a', 'b']);

      expect(result.map((week) => week.id)).toEqual(['c', 'a', 'b']);
      expect(result.map((week) => week.weekNumber)).toEqual([1, 2, 3]);
      expect(result.map((week) => week.sortOrder)).toEqual([1, 2, 3]);
    });

    it('skips ids that do not match a known week', () => {
      const weeks = [buildWeek({ id: 'a' }), buildWeek({ id: 'b', weekNumber: 2, sortOrder: 2 })];

      const result = reorderWeeks(weeks, ['b', 'missing', 'a']);

      expect(result.map((week) => week.id)).toEqual(['b', 'a']);
      expect(result.map((week) => week.weekNumber)).toEqual([1, 2]);
    });
  });
});
