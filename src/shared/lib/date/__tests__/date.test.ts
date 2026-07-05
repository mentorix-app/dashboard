import { formatDate, formatRelativeTime } from '../date';

describe('formatDate', () => {
  const iso = '2024-01-15T10:30:00.000Z';

  it('formats presets in en-US', () => {
    expect(formatDate(iso, 'en-US', 'shortDate')).toBe('Jan 15, 2024');
    expect(formatDate(iso, 'en-US', 'longDate')).toBe('January 15, 2024');
    expect(formatDate(iso, 'en-US', 'monthYear')).toBe('January 2024');
  });

  it('defaults to the shortDate preset', () => {
    expect(formatDate(iso, 'en-US')).toBe('Jan 15, 2024');
  });

  it('localizes month names for ru', () => {
    expect(formatDate(iso, 'ru', 'monthYear')).toBe('январь 2024 г.');
  });

  it('accepts timestamps and Date instances', () => {
    const date = new Date(iso);
    expect(formatDate(date, 'en-US', 'shortDate')).toBe('Jan 15, 2024');
    expect(formatDate(date.getTime(), 'en-US', 'shortDate')).toBe('Jan 15, 2024');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatDate('not-a-date', 'en-US')).toBe('');
    expect(formatDate('', 'en-US')).toBe('');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2024-01-15T12:00:00.000Z');

  it('formats past durations', () => {
    expect(formatRelativeTime('2024-01-13T12:00:00.000Z', 'en-US', now)).toBe('2 days ago');
    expect(formatRelativeTime('2024-01-15T11:30:00.000Z', 'en-US', now)).toBe('30 minutes ago');
  });

  it('formats future durations', () => {
    expect(formatRelativeTime('2024-01-18T12:00:00.000Z', 'en-US', now)).toBe('in 3 days');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatRelativeTime('nope', 'en-US', now)).toBe('');
  });
});
