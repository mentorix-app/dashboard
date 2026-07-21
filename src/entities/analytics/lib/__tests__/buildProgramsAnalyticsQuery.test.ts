import { buildProgramsAnalyticsQuery } from '../buildProgramsAnalyticsQuery';

describe('buildProgramsAnalyticsQuery', () => {
  it('returns an empty query for empty params', () => {
    expect(buildProgramsAnalyticsQuery({})).toEqual({});
  });

  it('maps the search term to q', () => {
    expect(buildProgramsAnalyticsQuery({ name: 'strength' })).toEqual({ q: 'strength' });
  });

  it('defaults the sort order to desc when only a sort field is given', () => {
    expect(buildProgramsAnalyticsQuery({ sortBy: 'lastActivity' })).toEqual({
      sort_by: 'last_activity',
      sort_order: 'desc',
    });
  });

  it('maps the name sort field and respects an explicit order', () => {
    expect(buildProgramsAnalyticsQuery({ sortBy: 'name', sortOrder: 'asc' })).toEqual({
      sort_by: 'name',
      sort_order: 'asc',
    });
  });

  it('combines search and sort params', () => {
    expect(buildProgramsAnalyticsQuery({ name: 'hyrox', sortBy: 'lastActivity', sortOrder: 'desc' })).toEqual({
      q: 'hyrox',
      sort_by: 'last_activity',
      sort_order: 'desc',
    });
  });

  it('omits the sort order when no sort field is selected', () => {
    expect(buildProgramsAnalyticsQuery({ sortOrder: 'asc' })).toEqual({});
  });
});
