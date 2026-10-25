import { getBlockSettings, getBlockTypeRule } from '@/src/entities/program/model/blockSettings';
import type { ProgramBlockSettingField, ProgramDayBlock } from '@/src/entities/program/model/structure';
import { splitDuration } from '@/src/shared/lib/duration';

/** One header chip describing a block's format settings, ready to be localized. Times are in seconds. */
export type BlockSettingChip =
  | { kind: 'rounds'; count: number }
  | { kind: 'duration'; seconds: number }
  | { kind: 'timeCap'; seconds: number }
  | { kind: 'work'; seconds: number }
  | { kind: 'rest'; seconds: number }
  | { kind: 'noRest' }
  | { kind: 'missing'; field: ProgramBlockSettingField };

/** How to say a duration: whole minutes (`12 min`), seconds only (`20 s`) or both (`1 min 30 s`). */
export type DurationLabel =
  | { unit: 'minutes'; minutes: number }
  | { unit: 'seconds'; seconds: number }
  | { unit: 'minutesSeconds'; minutes: number; seconds: number };

export const getDurationLabel = (totalSeconds: number): DurationLabel => {
  const { minutes, seconds } = splitDuration(totalSeconds);
  if (minutes === 0) return { unit: 'seconds', seconds };
  if (seconds === 0) return { unit: 'minutes', minutes };
  return { unit: 'minutesSeconds', minutes, seconds };
};

const toChip = (field: ProgramBlockSettingField, value: number): BlockSettingChip => {
  switch (field) {
    case 'rounds':
      return { kind: 'rounds', count: value };
    case 'durationSec':
      return { kind: 'duration', seconds: value };
    case 'timeCapSec':
      return { kind: 'timeCap', seconds: value };
    case 'workSec':
      return { kind: 'work', seconds: value };
    case 'restSec':
      return value === 0 ? { kind: 'noRest' } : { kind: 'rest', seconds: value };
  }
};

/**
 * Chips for the settings the block's type takes, in display order. A set value
 * becomes a chip; an empty required one becomes a "missing" chip (blocks saved
 * before settings existed); an empty optional one is skipped.
 */
export const getBlockSettingChips = (block: ProgramDayBlock): BlockSettingChip[] => {
  const rule = getBlockTypeRule(block.blockType);
  const settings = getBlockSettings(block);

  return rule.fields.flatMap((field): BlockSettingChip[] => {
    const value = settings[field];
    if (value !== null) return [toChip(field, value)];
    return rule.required.includes(field) ? [{ kind: 'missing', field }] : [];
  });
};
