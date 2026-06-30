import { Difficulty } from '@/src/shared/types';

import { ProgramCategory, ProgramStatus, type Program } from '@/src/entities/program/model/types';
import type { ProgramDay, ProgramWeek } from '@/src/entities/program/model/structure.types';

import { getCompletionPercent, getMissingRequiredFields, getStructureUnits } from '../ProgramWizardView.utils';

const buildProgram = (overrides: Partial<Program> = {}): Program => ({
  id: 'program-1',
  createdBy: 'user-1',
  createdByName: 'Coach Alex',
  modifiedBy: 'user-1',
  status: ProgramStatus.Draft,
  name: 'Mass gain',
  nameRu: 'Набор массы',
  description: 'Base mass program',
  descriptionRu: 'Базовая программа',
  category: ProgramCategory.MuscleGain,
  difficulty: Difficulty.Intermediate,
  previewImageUrl: 'https://example.com/cover.jpg',
  createdAt: '2024-01-01T00:00:00Z',
  modifiedAt: '2024-01-01T00:00:00Z',
  deletedAt: null,
  ...overrides,
});

const buildDay = (filled: boolean): ProgramDay => ({
  id: 'day-1',
  dayNumber: 1,
  sortOrder: 1,
  exercises: filled
    ? [
        {
          id: 'exercise-1',
          exerciseId: 'lib-1',
          exerciseName: 'Squat',
          exerciseNameRu: 'Присед',
          sortOrder: 1,
          sets: 3,
          reps: 10,
          weightKg: null,
          instruction: '',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]
    : [],
  createdAt: '2024-01-01T00:00:00Z',
});

const buildWeek = (days: ProgramDay[]): ProgramWeek => ({
  id: 'week-1',
  weekNumber: 1,
  sortOrder: 1,
  days,
  createdAt: '2024-01-01T00:00:00Z',
});

describe('ProgramWizardView utils', () => {
  describe('getMissingRequiredFields', () => {
    it('treats every required field as missing when the program is absent', () => {
      expect(getMissingRequiredFields()).toEqual([
        'name',
        'nameRu',
        'description',
        'descriptionRu',
        'category',
        'difficulty',
        'previewImageUrl',
      ]);
    });

    it('returns no missing fields for a fully filled program', () => {
      expect(getMissingRequiredFields(buildProgram())).toEqual([]);
    });

    it('flags empty strings, whitespace-only strings, and null selects', () => {
      const program = buildProgram({ name: '', descriptionRu: '   ', category: null });
      expect(getMissingRequiredFields(program)).toEqual(['name', 'descriptionRu', 'category']);
    });
  });

  describe('getCompletionPercent', () => {
    it('is 0% without a program', () => {
      expect(getCompletionPercent()).toBe(0);
    });

    it('is 100% when every field is filled', () => {
      expect(getCompletionPercent(buildProgram())).toBe(100);
    });

    it('rounds partial completion to the nearest percent', () => {
      // 5 of 7 filled → 71.43% → 71
      const program = buildProgram({ difficulty: null, previewImageUrl: '' });
      expect(getCompletionPercent(program)).toBe(71);
    });

    it('counts every day across the weeks once structure is provided', () => {
      // 7 fields + 2 days = 9 units; basics filled, days empty → 7/9 → 78
      const weeks = [buildWeek([buildDay(false), buildDay(false)])];
      expect(getCompletionPercent(buildProgram(), weeks)).toBe(78);
    });

    it('reaches 100% only when every day is filled', () => {
      const weeks = [buildWeek([buildDay(true), buildDay(true)])];
      expect(getCompletionPercent(buildProgram(), weeks)).toBe(100);
    });
  });

  describe('getStructureUnits', () => {
    it('returns zero units without weeks', () => {
      expect(getStructureUnits()).toEqual({ total: 0, filled: 0 });
    });

    it('counts filled days across all weeks', () => {
      const weeks = [buildWeek([buildDay(true), buildDay(false)]), buildWeek([buildDay(true)])];
      expect(getStructureUnits(weeks)).toEqual({ total: 3, filled: 2 });
    });
  });
});
