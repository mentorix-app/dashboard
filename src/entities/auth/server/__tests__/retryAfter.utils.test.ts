import { parseRetryAfterMs } from '../retryAfter.utils';

describe('parseRetryAfterMs', () => {
  it('reads whole seconds as milliseconds', () => {
    expect(parseRetryAfterMs('45')).toBe(45_000);
    expect(parseRetryAfterMs(' 7 ')).toBe(7_000);
  });

  it('reads an HTTP date relative to now', () => {
    const now = Date.parse('2026-10-20T10:00:00Z');

    expect(parseRetryAfterMs('Tue, 20 Oct 2026 10:01:00 GMT', now)).toBe(60_000);
  });

  it('never returns a negative wait for a date in the past', () => {
    const now = Date.parse('2026-10-20T10:00:00Z');

    expect(parseRetryAfterMs('Tue, 20 Oct 2026 09:00:00 GMT', now)).toBe(0);
  });

  it.each([null, undefined, '', '   ', 'soon', '-5', '1.5'])('returns undefined for %p', (value) => {
    expect(parseRetryAfterMs(value)).toBeUndefined();
  });
});
