import {
  createWeekResultsParams,
  getSortedUniqueNumbers,
  parseDayParam,
  parseWeekParam,
  parseWeekResultsView,
  resolveSelectedDay,
} from '../ProgramWeekResults.utils';

const reader = (params: Record<string, string>) => new URLSearchParams(params);

describe('ProgramWeekResults.utils', () => {
  describe('parseWeekParam', () => {
    // AC2: Preserve a valid explicit week from the URL.
    it('returns the URL week when it is available', () => {
      expect(parseWeekParam(reader({ week: '3' }), [5, 1, 3])).toBe(3);
    });

    // AC1: Clean and invalid URLs select the final raw analytics week item.
    it('falls back to the final raw week when the URL week is missing or unavailable', () => {
      expect(parseWeekParam(reader({}), [5, 1, 3])).toBe(3);
      expect(parseWeekParam(reader({ week: '9' }), [5, 1, 3])).toBe(3);
      expect(parseWeekParam(reader({}), [])).toBe(0);
    });
  });

  describe('parseWeekResultsView', () => {
    it('defaults to grid and rejects unknown values', () => {
      expect(parseWeekResultsView(reader({}))).toBe('grid');
      expect(parseWeekResultsView(reader({ view: 'list' }))).toBe('list');
      expect(parseWeekResultsView(reader({ view: 'table' }))).toBe('grid');
    });
  });

  describe('parseDayParam', () => {
    it('parses positive integers and returns null otherwise', () => {
      expect(parseDayParam(reader({ day: '4' }))).toBe(4);
      expect(parseDayParam(reader({}))).toBeNull();
      expect(parseDayParam(reader({ day: '0' }))).toBeNull();
      expect(parseDayParam(reader({ day: 'x' }))).toBeNull();
    });
  });

  describe('resolveSelectedDay', () => {
    // AC2: Preserve a valid explicit day from the URL.
    it('keeps a valid selection', () => {
      expect(resolveSelectedDay([5, 1, 3], 1)).toBe(1);
    });

    // AC1: Clean and invalid URLs select the final raw week-results day item.
    it('falls back to the final raw day', () => {
      expect(resolveSelectedDay([5, 1, 3], 2)).toBe(3);
      expect(resolveSelectedDay([5, 1, 3], null)).toBe(3);
      expect(resolveSelectedDay([], null)).toBe(0);
    });
  });

  describe('getSortedUniqueNumbers', () => {
    // IAC1: Selector options are ascending and duplicate-free without mutating the raw response.
    it('returns sorted duplicate-free selector values', () => {
      const rawValues = [5, 1, 3, 1, 5];

      expect(getSortedUniqueNumbers(rawValues)).toEqual([1, 3, 5]);
      expect(rawValues).toEqual([5, 1, 3, 1, 5]);
    });
  });

  describe('createWeekResultsParams', () => {
    it('merges updates onto the existing query string', () => {
      const params = createWeekResultsParams('week=2&view=list', { week: 4, view: 'grid', day: 3 });
      expect(params.get('week')).toBe('4');
      expect(params.get('view')).toBe('grid');
      expect(params.get('day')).toBe('3');
    });

    it('leaves unrelated params untouched', () => {
      const params = createWeekResultsParams('q=alex', { view: 'grid' });
      expect(params.get('q')).toBe('alex');
      expect(params.get('view')).toBe('grid');
    });

    // AC3: A week change clears the day as part of the same URL update.
    it('removes the day when requested while preserving other params', () => {
      const params = createWeekResultsParams('week=2&day=4&view=list&q=alex', { week: 3, day: null });

      expect(params.toString()).toBe('week=3&view=list&q=alex');
    });
  });
});
