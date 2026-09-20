import {
  getRemainingMinutes,
  hasCompleteLinkParams,
  pickLocalizedName,
  resolveErrorReason,
} from '../ClientStatsView.utils';

describe('ClientStatsView utilities', () => {
  it('requires every signed-link parameter', () => {
    expect(hasCompleteLinkParams({ clientUserId: 'client', trainerId: 'trainer', exp: '123', sig: 'sig' })).toBe(true);
    expect(hasCompleteLinkParams({ clientUserId: 'client', trainerId: 'trainer', exp: '123' })).toBe(false);
  });

  it.each([
    [400, 'broken'],
    [401, 'expired'],
    [404, 'unavailable'],
    [500, 'unknown'],
    [undefined, 'unknown'],
  ] as const)('maps status %s to %s', (status, reason) => {
    expect(resolveErrorReason(status)).toBe(reason);
  });

  it('rounds remaining time up to the next minute and clamps expired links', () => {
    const now = new Date('2026-09-20T10:00:00Z').getTime();
    expect(getRemainingMinutes('2026-09-20T10:01:01Z', now)).toBe(2);
    expect(getRemainingMinutes('2026-09-20T09:59:59Z', now)).toBe(0);
  });

  it('prefers the active locale and falls back to a populated name', () => {
    expect(pickLocalizedName('ru', 'Strength', 'Сила')).toBe('Сила');
    expect(pickLocalizedName('ru', 'Strength', '')).toBe('Strength');
  });
});
