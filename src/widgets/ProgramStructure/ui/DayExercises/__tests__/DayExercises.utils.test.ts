import type { ProgramDayExerciseInput } from '@/src/entities/program';

import {
  formatVolumeField,
  isSameExerciseInput,
  normalizeExerciseInput,
  sanitizeVolumeInput,
  toVolumeField,
} from '../lib';

describe('DayExercises utils', () => {
  describe('sanitizeVolumeInput', () => {
    it('keeps digits, slashes, and dashes', () => {
      expect(sanitizeVolumeInput('5/4')).toBe('5/4');
      expect(sanitizeVolumeInput('3-6')).toBe('3-6');
      expect(sanitizeVolumeInput('16/10')).toBe('16/10');
    });

    it('strips any other characters', () => {
      expect(sanitizeVolumeInput('3 reps')).toBe('3');
      expect(sanitizeVolumeInput('abc')).toBe('');
      expect(sanitizeVolumeInput('8.9')).toBe('89');
    });
  });

  describe('toVolumeField', () => {
    it('trims and preserves valid volume text', () => {
      expect(toVolumeField('  3/4 ')).toBe('3/4');
      expect(toVolumeField('12')).toBe('12');
    });

    it('treats blank and nullish input as null', () => {
      expect(toVolumeField('')).toBeNull();
      expect(toVolumeField('   ')).toBeNull();
      expect(toVolumeField(null)).toBeNull();
      expect(toVolumeField(undefined)).toBeNull();
    });
  });

  describe('formatVolumeField', () => {
    it('renders strings and blanks nullish values', () => {
      expect(formatVolumeField('5/4')).toBe('5/4');
      expect(formatVolumeField('0')).toBe('0');
      expect(formatVolumeField(null)).toBe('');
      expect(formatVolumeField(undefined)).toBe('');
    });
  });

  describe('normalizeExerciseInput', () => {
    it('trims instruction and coerces nullish instruction to an empty string', () => {
      expect(
        normalizeExerciseInput({
          exerciseId: 'ex-1',
          sets: '3',
          reps: '10',
          instruction: '  keep back straight  ',
        })
      ).toEqual({ exerciseId: 'ex-1', sets: '3', reps: '10', instruction: 'keep back straight' });

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
      const server: ProgramDayExerciseInput = { exerciseId: 'ex-1', sets: '3', reps: '10', instruction: 'go slow' };

      const baseline = normalizeExerciseInput(server);
      const liveInput: ProgramDayExerciseInput = {
        exerciseId: server.exerciseId,
        sets: toVolumeField('3'),
        reps: toVolumeField('10'),
        instruction: 'go slow'.trim(),
      };

      expect(isSameExerciseInput(liveInput, baseline)).toBe(true);
    });
  });

  describe('isSameExerciseInput', () => {
    it('detects a changed editable field', () => {
      const base: ProgramDayExerciseInput = { exerciseId: 'ex-1', sets: '3', reps: '10', instruction: '' };

      expect(isSameExerciseInput(base, { ...base, reps: '12' })).toBe(false);
      expect(isSameExerciseInput(base, { ...base, instruction: 'slow' })).toBe(false);
      expect(isSameExerciseInput(base, { ...base })).toBe(true);
    });
  });
});
