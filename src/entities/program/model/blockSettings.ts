import {
  ProgramBlockType,
  type ProgramBlockDurationField,
  type ProgramBlockSettingField,
  type ProgramBlockSettings,
  type ProgramDayBlock,
} from './structure';

/** What a block type accepts, mirroring the backend rules table (`block_type.go`). */
export type BlockTypeRule = {
  /** Whether exercises in a block of this type carry sets. */
  hasSets: boolean;
  /** Settings the type accepts, in display order. */
  fields: readonly ProgramBlockSettingField[];
  /** Settings the editor asks for before saving; the API itself allows them empty. */
  required: readonly ProgramBlockSettingField[];
};

const PLAIN_RULE: BlockTypeRule = { hasSets: true, fields: [], required: [] };

export const BLOCK_TYPE_RULES: Record<ProgramBlockType, BlockTypeRule> = {
  [ProgramBlockType.Single]: PLAIN_RULE,
  [ProgramBlockType.Emom]: { hasSets: false, fields: ['rounds'], required: ['rounds'] },
  [ProgramBlockType.Amrap]: { hasSets: false, fields: ['durationSec'], required: ['durationSec'] },
  [ProgramBlockType.ForTime]: { hasSets: false, fields: ['rounds', 'timeCapSec'], required: [] },
  [ProgramBlockType.Intervals]: {
    hasSets: false,
    fields: ['rounds', 'workSec', 'restSec'],
    required: ['rounds', 'workSec'],
  },
  [ProgramBlockType.Chipper]: { hasSets: false, fields: [], required: [] },
  [ProgramBlockType.Superset]: { hasSets: false, fields: ['rounds'], required: ['rounds'] },
  [ProgramBlockType.SkillWork]: PLAIN_RULE,
  [ProgramBlockType.Strength]: PLAIN_RULE,
  [ProgramBlockType.Conditioning]: PLAIN_RULE,
  [ProgramBlockType.Gymnastics]: PLAIN_RULE,
  [ProgramBlockType.Weightlifting]: PLAIN_RULE,
};

export const BLOCK_SETTING_FIELDS: readonly ProgramBlockSettingField[] = [
  'rounds',
  'durationSec',
  'timeCapSec',
  'workSec',
  'restSec',
];

/** Inclusive bounds the backend enforces; times are seconds (24 h max). */
export const BLOCK_SETTING_LIMITS: Record<ProgramBlockSettingField, { min: number; max: number }> = {
  rounds: { min: 1, max: 100 },
  durationSec: { min: 1, max: 86400 },
  timeCapSec: { min: 1, max: 86400 },
  workSec: { min: 1, max: 86400 },
  restSec: { min: 0, max: 86400 },
};

export const EMPTY_BLOCK_SETTINGS: ProgramBlockSettings = {
  rounds: null,
  durationSec: null,
  timeCapSec: null,
  workSec: null,
  restSec: null,
};

const KNOWN_BLOCK_TYPES = new Set<string>(Object.values(ProgramBlockType));

/**
 * Types the API removed. The backend migration turns them into skill work, so
 * until it has run (e.g. an older stage backend still merging into `complex`)
 * they read as skill work here too.
 */
const LEGACY_BLOCK_TYPES = new Map<string, ProgramBlockType>([
  ['complex', ProgramBlockType.SkillWork],
  ['ladder', ProgramBlockType.SkillWork],
  ['death_by', ProgramBlockType.SkillWork],
]);

export const isProgramBlockType = (value: string): value is ProgramBlockType => KNOWN_BLOCK_TYPES.has(value);

/** The known type a raw API value stands for: itself, its replacement for a removed type, or null. */
export const resolveBlockType = (value: string): ProgramBlockType | null =>
  isProgramBlockType(value) ? value : (LEGACY_BLOCK_TYPES.get(value) ?? null);

/** Every setting except `rounds` is a duration in seconds, entered as minutes and seconds. */
export const isDurationSetting = (field: ProgramBlockSettingField): field is ProgramBlockDurationField =>
  field !== 'rounds';

/** Rule for a block type; an unknown value is treated as a plain block. */
export const getBlockTypeRule = (blockType: string): BlockTypeRule => {
  const resolved = resolveBlockType(blockType);
  return resolved ? BLOCK_TYPE_RULES[resolved] : PLAIN_RULE;
};

export const blockHasSets = (blockType: string): boolean => getBlockTypeRule(blockType).hasSets;

/** Reads a block's settings, tolerating a payload that predates them. */
export const getBlockSettings = (block: Partial<ProgramBlockSettings>): ProgramBlockSettings => ({
  rounds: block.rounds ?? null,
  durationSec: block.durationSec ?? null,
  timeCapSec: block.timeCapSec ?? null,
  workSec: block.workSec ?? null,
  restSec: block.restSec ?? null,
});

/** Required settings of the block's type that are still empty (e.g. blocks saved before settings existed). */
export const getMissingRequiredSettings = (block: ProgramDayBlock): ProgramBlockSettingField[] => {
  const settings = getBlockSettings(block);
  return getBlockTypeRule(block.blockType).required.filter((field) => settings[field] === null);
};
