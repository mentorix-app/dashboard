const SECONDS_PER_MINUTE = 60;

export type DurationParts = { minutes: number; seconds: number };

/** Splits seconds into whole minutes and the remaining seconds: `90` → 1 min 30 s. */
export const splitDuration = (totalSeconds: number): DurationParts => {
  const whole = Math.max(0, Math.trunc(totalSeconds));
  return { minutes: Math.floor(whole / SECONDS_PER_MINUTE), seconds: whole % SECONDS_PER_MINUTE };
};

export const joinDuration = ({ minutes, seconds }: DurationParts): number => minutes * SECONDS_PER_MINUTE + seconds;
