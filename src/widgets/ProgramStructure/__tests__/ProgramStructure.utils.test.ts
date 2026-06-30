import type { ProgramDay, ProgramWeek } from '@/src/entities/program';

import { buildLocalDay, buildLocalWeek, reorderDays, reorderWeeks } from '../ProgramStructure.utils';

const buildWeek = (overrides: Partial<ProgramWeek> = {}): ProgramWeek => ({
  id: 'week-1',
  weekNumber: 1,
  sortOrder: 1,
  days: [],
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const buildDay = (overrides: Partial<ProgramDay> = {}): ProgramDay => ({
  id: 'day-1',
  dayNumber: 1,
  sortOrder: 1,
  exercises: [],
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

  describe('buildLocalDay', () => {
    it('appends the next day number with no exercises', () => {
      const days = [buildDay({ id: 'a' }), buildDay({ id: 'b', dayNumber: 2, sortOrder: 2 })];

      const day = buildLocalDay(days);

      expect(day.dayNumber).toBe(3);
      expect(day.sortOrder).toBe(3);
      expect(day.exercises).toEqual([]);
      expect(day.id).toEqual(expect.any(String));
    });

    it('numbers the first day as 1', () => {
      expect(buildLocalDay([]).dayNumber).toBe(1);
    });
  });

  describe('reorderDays', () => {
    it('reorders days to match the id order and renumbers them', () => {
      const days = [
        buildDay({ id: 'a', dayNumber: 1, sortOrder: 1 }),
        buildDay({ id: 'b', dayNumber: 2, sortOrder: 2 }),
        buildDay({ id: 'c', dayNumber: 3, sortOrder: 3 }),
      ];

      const result = reorderDays(days, ['c', 'a', 'b']);

      expect(result.map((day) => day.id)).toEqual(['c', 'a', 'b']);
      expect(result.map((day) => day.dayNumber)).toEqual([1, 2, 3]);
      expect(result.map((day) => day.sortOrder)).toEqual([1, 2, 3]);
    });

    it('skips ids that do not match a known day', () => {
      const days = [buildDay({ id: 'a' }), buildDay({ id: 'b', dayNumber: 2, sortOrder: 2 })];

      const result = reorderDays(days, ['b', 'missing', 'a']);

      expect(result.map((day) => day.id)).toEqual(['b', 'a']);
      expect(result.map((day) => day.dayNumber)).toEqual([1, 2]);
    });
  });
});
