import { BLOCK_SETTING_LIMITS, getBlockSettings, isDurationSetting } from '@/src/entities/program/model/blockSettings';
import type {
  ProgramBlockDurationField,
  ProgramBlockSettingField,
  ProgramDayBlock,
} from '@/src/entities/program/model/structure';
import { joinDuration, splitDuration } from '@/src/shared/lib/duration';

import { toGroupType } from '../BlockEditDialog/BlockEditDialog.utils';
import type { BlockEditFormValues, DurationInput } from './BlockEditForm.types';

export type SettingParseResult = { ok: true; value: number | null } | { ok: false; reason: 'format' | 'range' };

const DIGITS = /^\d+$/;

const withinLimits = (field: ProgramBlockSettingField, value: number): SettingParseResult => {
  const { min, max } = BLOCK_SETTING_LIMITS[field];
  return value < min || value > max ? { ok: false, reason: 'range' } : { ok: true, value };
};

/** Rounds: blank is null; anything but a whole number in bounds is reported, not coerced. */
export const parseRoundsInput = (raw: string): SettingParseResult => {
  const value = raw.trim();
  if (value === '') return { ok: true, value: null };
  return DIGITS.test(value) ? withinLimits('rounds', Number(value)) : { ok: false, reason: 'format' };
};

/**
 * A time from its minutes and seconds inputs. Both blank is null; one blank
 * counts as zero; seconds may exceed 59 (`0 min 90 s` is 90 seconds).
 */
export const parseDurationInput = (field: ProgramBlockDurationField, input: DurationInput): SettingParseResult => {
  const minutes = input.minutes.trim();
  const seconds = input.seconds.trim();
  if (minutes === '' && seconds === '') return { ok: true, value: null };
  if ((minutes !== '' && !DIGITS.test(minutes)) || (seconds !== '' && !DIGITS.test(seconds))) {
    return { ok: false, reason: 'format' };
  }
  return withinLimits(field, joinDuration({ minutes: Number(minutes || 0), seconds: Number(seconds || 0) }));
};

export const parseSettingInput = (values: BlockEditFormValues, field: ProgramBlockSettingField): SettingParseResult =>
  isDurationSetting(field) ? parseDurationInput(field, values[field]) : parseRoundsInput(values.rounds);

/** Renders stored seconds into the two inputs (`90` → 1 min 30 s); null leaves both blank. */
export const toDurationInput = (totalSeconds: number | null): DurationInput => {
  if (totalSeconds === null) return { minutes: '', seconds: '' };
  const { minutes, seconds } = splitDuration(totalSeconds);
  return { minutes: String(minutes), seconds: String(seconds) };
};

/** Tidies a typed time once focus leaves it: fills a blank part with 0 and carries extra seconds into minutes. */
export const normalizeDurationInput = (field: ProgramBlockDurationField, input: DurationInput): DurationInput => {
  const parsed = parseDurationInput(field, input);
  if (parsed.ok) return toDurationInput(parsed.value);
  if (parsed.reason === 'format') return input;
  const total = joinDuration({ minutes: Number(input.minutes || 0), seconds: Number(input.seconds || 0) });
  return toDurationInput(total);
};

export const toBlockEditFormValues = (block: ProgramDayBlock): BlockEditFormValues => {
  const settings = getBlockSettings(block);
  return {
    blockType: toGroupType(block.blockType),
    instruction: block.instruction,
    rounds: settings.rounds === null ? '' : String(settings.rounds),
    durationSec: toDurationInput(settings.durationSec),
    timeCapSec: toDurationInput(settings.timeCapSec),
    workSec: toDurationInput(settings.workSec),
    restSec: toDurationInput(settings.restSec),
  };
};
