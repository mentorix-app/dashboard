import { joinDuration, splitDuration } from '../duration.utils';

describe('splitDuration', () => {
  it('splits seconds into minutes and the remaining seconds', () => {
    expect(splitDuration(0)).toEqual({ minutes: 0, seconds: 0 });
    expect(splitDuration(20)).toEqual({ minutes: 0, seconds: 20 });
    expect(splitDuration(90)).toEqual({ minutes: 1, seconds: 30 });
    expect(splitDuration(720)).toEqual({ minutes: 12, seconds: 0 });
    expect(splitDuration(86400)).toEqual({ minutes: 1440, seconds: 0 });
  });

  it('ignores fractions and negative input', () => {
    expect(splitDuration(65.9)).toEqual({ minutes: 1, seconds: 5 });
    expect(splitDuration(-5)).toEqual({ minutes: 0, seconds: 0 });
  });
});

describe('joinDuration', () => {
  it('turns minutes and seconds back into seconds, carrying overflowing seconds', () => {
    expect(joinDuration({ minutes: 12, seconds: 0 })).toBe(720);
    expect(joinDuration({ minutes: 0, seconds: 90 })).toBe(90);
    expect(joinDuration(splitDuration(1234))).toBe(1234);
  });
});
