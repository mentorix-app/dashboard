import type { ProgramDay, ProgramWeek } from '@/src/entities/program';

import {
  isSameExerciseInput,
  normalizeExerciseInput,
  parseCountField,
  parseWeightField,
  withMovedExercise,
  withReorderedDay,
} from '../DayExercises.utils';

const buildDay = (id: string, exerciseIds: string[]): ProgramDay => ({
  id,
  dayNumber: 1,
  sortOrder: 1,
  exercises: exerciseIds.map((exerciseItemId, index) => ({
    id: exerciseItemId,
    exerciseId: `ex-${exerciseItemId}`,
    exerciseName: exerciseItemId,
    exerciseNameRu: exerciseItemId,
    sortOrder: index + 1,
    sets: null,
    reps: null,
    weightKg: null,
    instruction: '',
    createdAt: '2024-01-01T00:00:00Z',
  })),
  createdAt: '2024-01-01T00:00:00Z',
});

const buildWeek = (days: ProgramDay[]): ProgramWeek => ({
  id: 'week-1',
  weekNumber: 1,
  sortOrder: 1,
  days,
  createdAt: '2024-01-01T00:00:00Z',
});

describe('DayExercises utils', () => {
  describe('parseCountField', () => {
    it('parses a whole number', () => {
      expect(parseCountField('12')).toBe(12);
    });

    it('treats blank, invalid, and negative input as null', () => {
      expect(parseCountField('')).toBeNull();
      expect(parseCountField('   ')).toBeNull();
      expect(parseCountField('abc')).toBeNull();
      expect(parseCountField('-3')).toBeNull();
    });

    it('truncates decimals to an integer', () => {
      expect(parseCountField('8.9')).toBe(8);
    });
  });

  describe('parseWeightField', () => {
    it('parses a float', () => {
      expect(parseWeightField('22.5')).toBe(22.5);
    });

    it('treats blank, invalid, and negative input as null', () => {
      expect(parseWeightField('')).toBeNull();
      expect(parseWeightField('heavy')).toBeNull();
      expect(parseWeightField('-1')).toBeNull();
    });
  });

  describe('normalizeExerciseInput', () => {
    it('trims instruction and coerces nullish instruction to an empty string', () => {
      expect(
        normalizeExerciseInput({
          exerciseId: 'ex-1',
          sets: 3,
          reps: 10,
          weightKg: 20,
          instruction: '  keep back straight  ',
        })
      ).toEqual({ exerciseId: 'ex-1', sets: 3, reps: 10, weightKg: 20, instruction: 'keep back straight' });

      expect(
        normalizeExerciseInput({
          exerciseId: 'ex-1',
          sets: null,
          reps: null,
          weightKg: null,
          instruction: null as unknown as string,
        }).instruction
      ).toBe('');
    });

    it('produces a baseline equal to freshly parsed row input for unchanged server data', () => {
      const server = { exerciseId: 'ex-1', sets: 3, reps: 10, weightKg: 20.5, instruction: 'go slow' };

      const baseline = normalizeExerciseInput(server);
      const liveInput = {
        exerciseId: server.exerciseId,
        sets: parseCountField('3'),
        reps: parseCountField('10'),
        weightKg: parseWeightField('20.5'),
        instruction: 'go slow'.trim(),
      };

      expect(isSameExerciseInput(liveInput, baseline)).toBe(true);
    });
  });

  describe('withReorderedDay', () => {
    it('replaces only the target day order and leaves others untouched', () => {
      const week = buildWeek([buildDay('day-1', ['a', 'b', 'c']), buildDay('day-2', ['x', 'y'])]);

      const result = withReorderedDay(week, 'day-1', ['c', 'a', 'b']);

      expect(result).toEqual([
        { dayId: 'day-1', exerciseItemIds: ['c', 'a', 'b'] },
        { dayId: 'day-2', exerciseItemIds: ['x', 'y'] },
      ]);
    });
  });

  describe('withMovedExercise', () => {
    it('removes the item from its day and appends it to the target day', () => {
      const week = buildWeek([buildDay('day-1', ['a', 'b', 'c']), buildDay('day-2', ['x', 'y'])]);

      const result = withMovedExercise(week, 'day-1', 'day-2', 'b');

      expect(result).toEqual([
        { dayId: 'day-1', exerciseItemIds: ['a', 'c'] },
        { dayId: 'day-2', exerciseItemIds: ['x', 'y', 'b'] },
      ]);
    });
  });
});
