import { reverseWeekOrder } from './WeeksSidebar.utils';

describe('reverseWeekOrder', () => {
  it('returns the newest week first without mutating the source order', () => {
    const weekIds = ['week-1', 'week-2', 'week-3', 'week-4'];

    expect(reverseWeekOrder(weekIds)).toEqual(['week-4', 'week-3', 'week-2', 'week-1']);
    expect(weekIds).toEqual(['week-1', 'week-2', 'week-3', 'week-4']);
  });

  it('converts a reordered display list back to chronological API order', () => {
    const reorderedDisplayIds = ['week-3', 'week-4', 'week-2', 'week-1'];

    expect(reverseWeekOrder(reorderedDisplayIds)).toEqual(['week-1', 'week-2', 'week-4', 'week-3']);
  });
});
