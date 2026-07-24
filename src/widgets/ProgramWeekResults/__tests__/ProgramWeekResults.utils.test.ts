import {
  createWeekResultsParams,
  parseDayParam,
  parseWeekParam,
  parseWeekResultsView,
  resolveSelectedDay,
} from '../ProgramWeekResults.utils';

const reader = (params: Record<string, string>) => new URLSearchParams(params);

describe('ProgramWeekResults.utils', () => {
  describe('parseWeekParam', () => {
    it('returns the URL week when it is available', () => {
      expect(parseWeekParam(reader({ week: '3' }), [1, 2, 3], 1)).toBe(3);
    });

    it('falls back when the week is missing or unavailable', () => {
      expect(parseWeekParam(reader({}), [1, 2], 2)).toBe(2);
      expect(parseWeekParam(reader({ week: '9' }), [1, 2], 1)).toBe(1);
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
    it('keeps a valid selection and clamps to the first day otherwise', () => {
      expect(resolveSelectedDay([1, 3, 5], 3)).toBe(3);
      expect(resolveSelectedDay([1, 3, 5], 2)).toBe(1);
      expect(resolveSelectedDay([1, 3, 5], null)).toBe(1);
      expect(resolveSelectedDay([], null)).toBe(0);
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
  });
});
