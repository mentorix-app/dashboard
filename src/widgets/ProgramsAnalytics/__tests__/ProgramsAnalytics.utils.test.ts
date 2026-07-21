import { ProgramStatus } from '@/src/entities/program/model/types';

import {
  createProgramsAnalyticsSearchParams,
  isAnalyticsDetailAvailable,
  parseProgramsAnalyticsSearchParams,
  toProgramStatusEnum,
} from '../ProgramsAnalytics.utils';

const reader = (values: Record<string, string>) => ({
  get: (name: string) => values[name] ?? null,
});

describe('ProgramsAnalytics.utils', () => {
  describe('parseProgramsAnalyticsSearchParams', () => {
    it('applies defaults when no params are present', () => {
      expect(parseProgramsAnalyticsSearchParams(reader({}))).toEqual({
        name: undefined,
        sortBy: 'lastActivity',
        sortOrder: 'desc',
      });
    });

    it('reads and trims the search term', () => {
      expect(parseProgramsAnalyticsSearchParams(reader({ q: '  hyrox  ' })).name).toBe('hyrox');
    });

    it('falls back to defaults for invalid sort values', () => {
      const state = parseProgramsAnalyticsSearchParams(reader({ sort: 'bogus', order: 'sideways' }));
      expect(state.sortBy).toBe('lastActivity');
      expect(state.sortOrder).toBe('desc');
    });

    it('honours valid sort values', () => {
      const state = parseProgramsAnalyticsSearchParams(reader({ sort: 'name', order: 'asc' }));
      expect(state.sortBy).toBe('name');
      expect(state.sortOrder).toBe('asc');
    });
  });

  describe('createProgramsAnalyticsSearchParams', () => {
    it('sets q when a name is provided and removes it when cleared', () => {
      expect(createProgramsAnalyticsSearchParams('', { name: 'legs' }).get('q')).toBe('legs');
      expect(createProgramsAnalyticsSearchParams('q=legs', { name: '   ' }).get('q')).toBeNull();
    });

    it('writes sort and order params', () => {
      const params = createProgramsAnalyticsSearchParams('', { sortBy: 'name', sortOrder: 'asc' });
      expect(params.get('sort')).toBe('name');
      expect(params.get('order')).toBe('asc');
    });

    it('preserves existing params it does not touch', () => {
      expect(createProgramsAnalyticsSearchParams('order=desc', { name: 'x' }).get('order')).toBe('desc');
    });
  });

  describe('isAnalyticsDetailAvailable', () => {
    it('is false for drafts and true otherwise', () => {
      expect(isAnalyticsDetailAvailable('draft')).toBe(false);
      expect(isAnalyticsDetailAvailable('published')).toBe(true);
      expect(isAnalyticsDetailAvailable('archived')).toBe(true);
    });
  });

  describe('toProgramStatusEnum', () => {
    it('maps analytics statuses to the program status enum', () => {
      expect(toProgramStatusEnum('draft')).toBe(ProgramStatus.Draft);
      expect(toProgramStatusEnum('published')).toBe(ProgramStatus.Published);
      expect(toProgramStatusEnum('archived')).toBe(ProgramStatus.Archived);
    });
  });
});
