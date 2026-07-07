import type { ProgramDayExerciseInput } from '@/src/entities/program';

import { formatNumberField, isSameExerciseInput, normalizeExerciseInput, parseCountField } from '../lib';

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

  describe('formatNumberField', () => {
    it('renders numbers and blanks nullish values', () => {
      expect(formatNumberField(5)).toBe('5');
      expect(formatNumberField(0)).toBe('0');
      expect(formatNumberField(null)).toBe('');
      expect(formatNumberField(undefined)).toBe('');
    });
  });

  describe('normalizeExerciseInput', () => {
    it('trims instruction and coerces nullish instruction to an empty string', () => {
      expect(
        normalizeExerciseInput({
          exerciseId: 'ex-1',
          sets: 3,
          reps: 10,
          instruction: '  keep back straight  ',
        })
      ).toEqual({ exerciseId: 'ex-1', sets: 3, reps: 10, instruction: 'keep back straight' });

      expect(
        normalizeExerciseInput({
          exerciseId: 'ex-1',
          sets: null,
          reps: null,
          instruction: null as unknown as string,
        }).instruction
      ).toBe('');
    });

    it('produces a baseline equal to freshly parsed row input for unchanged server data', () => {
      const server: ProgramDayExerciseInput = { exerciseId: 'ex-1', sets: 3, reps: 10, instruction: 'go slow' };

      const baseline = normalizeExerciseInput(server);
      const liveInput: ProgramDayExerciseInput = {
        exerciseId: server.exerciseId,
        sets: parseCountField('3'),
        reps: parseCountField('10'),
        instruction: 'go slow'.trim(),
      };

      expect(isSameExerciseInput(liveInput, baseline)).toBe(true);
    });
  });

  describe('isSameExerciseInput', () => {
    it('detects a changed editable field', () => {
      const base: ProgramDayExerciseInput = { exerciseId: 'ex-1', sets: 3, reps: 10, instruction: '' };

      expect(isSameExerciseInput(base, { ...base, reps: 12 })).toBe(false);
      expect(isSameExerciseInput(base, { ...base, instruction: 'slow' })).toBe(false);
      expect(isSameExerciseInput(base, { ...base })).toBe(true);
    });
  });
});
