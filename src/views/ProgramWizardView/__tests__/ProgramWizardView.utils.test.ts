import { Difficulty } from '@/src/shared/types';

import { ProgramCategory, ProgramStatus, type Program } from '@/src/entities/program/model/types';

import { getCompletionPercent, getMissingRequiredFields } from '../ProgramWizardView.utils';

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
  });
});
