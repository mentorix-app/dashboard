import { Hourglass, Pause, Repeat, Timer, Zap, type LucideIcon } from 'lucide-react';

import { ProgramBlockType, type ProgramBlockSettingField } from '@/src/entities/program/model/structure';

/**
 * Exercise rows keep drag/select controls and actions vertically centred around
 * a responsive content area. Content stacks on narrow screens and becomes two
 * columns (title with sets/reps, then instruction) on desktop.
 */
export const EXERCISE_ROW_LAYOUT = 'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2';

/** Message keys for each block type label, kept literal so next-intl stays typed. */
export const BLOCK_TYPE_LABEL_KEY = {
  [ProgramBlockType.Single]: 'structure.blocks.types.single',
  [ProgramBlockType.Emom]: 'structure.blocks.types.emom',
  [ProgramBlockType.Amrap]: 'structure.blocks.types.amrap',
  [ProgramBlockType.ForTime]: 'structure.blocks.types.for_time',
  [ProgramBlockType.Intervals]: 'structure.blocks.types.intervals',
  [ProgramBlockType.Chipper]: 'structure.blocks.types.chipper',
  [ProgramBlockType.Superset]: 'structure.blocks.types.superset',
  [ProgramBlockType.SkillWork]: 'structure.blocks.types.skill_work',
  [ProgramBlockType.Strength]: 'structure.blocks.types.strength',
  [ProgramBlockType.Conditioning]: 'structure.blocks.types.conditioning',
  [ProgramBlockType.Gymnastics]: 'structure.blocks.types.gymnastics',
  [ProgramBlockType.Weightlifting]: 'structure.blocks.types.weightlifting',
} as const;

/** Label for a block type the dashboard does not know (e.g. one the API removed). */
export const UNKNOWN_BLOCK_TYPE_LABEL_KEY = 'structure.blocks.types.unknown';

/** One-line explanation of each workout format, shown above its settings; sections and singles have none. */
export const BLOCK_FORMAT_HINT_KEY = {
  [ProgramBlockType.Single]: null,
  [ProgramBlockType.Emom]: 'structure.blocks.settings.formats.emom',
  [ProgramBlockType.Amrap]: 'structure.blocks.settings.formats.amrap',
  [ProgramBlockType.ForTime]: 'structure.blocks.settings.formats.for_time',
  [ProgramBlockType.Intervals]: 'structure.blocks.settings.formats.intervals',
  [ProgramBlockType.Chipper]: 'structure.blocks.settings.formats.chipper',
  [ProgramBlockType.Superset]: 'structure.blocks.settings.formats.superset',
  [ProgramBlockType.SkillWork]: null,
  [ProgramBlockType.Strength]: null,
  [ProgramBlockType.Conditioning]: null,
  [ProgramBlockType.Gymnastics]: null,
  [ProgramBlockType.Weightlifting]: null,
} as const;

export const BLOCK_SETTING_ICON: Record<ProgramBlockSettingField, LucideIcon> = {
  rounds: Repeat,
  durationSec: Timer,
  timeCapSec: Hourglass,
  workSec: Zap,
  restSec: Pause,
};

export const BLOCK_SETTING_LABEL_KEY = {
  rounds: 'structure.blocks.settings.fields.rounds',
  durationSec: 'structure.blocks.settings.fields.durationSec',
  timeCapSec: 'structure.blocks.settings.fields.timeCapSec',
  workSec: 'structure.blocks.settings.fields.workSec',
  restSec: 'structure.blocks.settings.fields.restSec',
} as const satisfies Record<ProgramBlockSettingField, string>;

/** Help under a setting input; fields that need none map to null. */
export const BLOCK_SETTING_HINT_KEY = {
  rounds: 'structure.blocks.settings.hints.rounds',
  durationSec: null,
  timeCapSec: null,
  workSec: null,
  restSec: 'structure.blocks.settings.hints.rest',
} as const satisfies Record<ProgramBlockSettingField, string | null>;

/** Header chip text for a required setting that is still empty. */
export const BLOCK_SETTING_MISSING_KEY = {
  rounds: 'structure.blocks.settings.summary.missing.rounds',
  durationSec: 'structure.blocks.settings.summary.missing.durationSec',
  timeCapSec: 'structure.blocks.settings.summary.missing.timeCapSec',
  workSec: 'structure.blocks.settings.summary.missing.workSec',
  restSec: 'structure.blocks.settings.summary.missing.restSec',
} as const satisfies Record<ProgramBlockSettingField, string>;
