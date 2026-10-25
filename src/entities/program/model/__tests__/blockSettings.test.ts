import {
  BLOCK_TYPE_RULES,
  EMPTY_BLOCK_SETTINGS,
  blockHasSets,
  getBlockSettings,
  getBlockTypeRule,
  getMissingRequiredSettings,
  isDurationSetting,
  isProgramBlockType,
  resolveBlockType,
} from '../blockSettings';
import { FORMAT_BLOCK_TYPES, ProgramBlockType, SECTION_BLOCK_TYPES, type ProgramDayBlock } from '../structure';

const buildBlock = (overrides: Partial<ProgramDayBlock> = {}): ProgramDayBlock => ({
  id: 'block-1',
  blockType: ProgramBlockType.Emom,
  instruction: '',
  sortOrder: 1,
  clientUserIds: [],
  exercises: [],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
  ...overrides,
});

describe('BLOCK_TYPE_RULES', () => {
  it('mirrors the backend settings per type', () => {
    expect(BLOCK_TYPE_RULES[ProgramBlockType.Emom].fields).toEqual(['rounds']);
    expect(BLOCK_TYPE_RULES[ProgramBlockType.Superset].fields).toEqual(['rounds']);
    expect(BLOCK_TYPE_RULES[ProgramBlockType.Amrap].fields).toEqual(['durationSec']);
    expect(BLOCK_TYPE_RULES[ProgramBlockType.ForTime].fields).toEqual(['rounds', 'timeCapSec']);
    expect(BLOCK_TYPE_RULES[ProgramBlockType.Intervals].fields).toEqual(['rounds', 'workSec', 'restSec']);
    expect(BLOCK_TYPE_RULES[ProgramBlockType.Chipper].fields).toEqual([]);
  });

  it('drops sets for every format type and keeps them for sections and singles', () => {
    FORMAT_BLOCK_TYPES.forEach((type) => expect(blockHasSets(type)).toBe(false));
    SECTION_BLOCK_TYPES.forEach((type) => expect(blockHasSets(type)).toBe(true));
    expect(blockHasSets(ProgramBlockType.Single)).toBe(true);
  });

  it('only requires settings the type accepts', () => {
    Object.values(BLOCK_TYPE_RULES).forEach((rule) => {
      rule.required.forEach((field) => expect(rule.fields).toContain(field));
    });
  });
});

describe('getBlockTypeRule', () => {
  it('treats an unknown type as a plain block with sets and no settings', () => {
    expect(isProgramBlockType('mystery')).toBe(false);
    expect(getBlockTypeRule('mystery')).toEqual({ hasSets: true, fields: [], required: [] });
  });
});

describe('resolveBlockType', () => {
  it('keeps known types and reads removed ones as skill work, like the backend migration', () => {
    expect(resolveBlockType(ProgramBlockType.Emom)).toBe(ProgramBlockType.Emom);
    expect(resolveBlockType('complex')).toBe(ProgramBlockType.SkillWork);
    expect(resolveBlockType('ladder')).toBe(ProgramBlockType.SkillWork);
    expect(resolveBlockType('death_by')).toBe(ProgramBlockType.SkillWork);
    expect(resolveBlockType('mystery')).toBeNull();
  });
});

describe('getBlockSettings', () => {
  it('fills settings missing from an older payload with null', () => {
    expect(getBlockSettings({ rounds: 5 })).toEqual({ ...EMPTY_BLOCK_SETTINGS, rounds: 5 });
  });
});

describe('getMissingRequiredSettings', () => {
  it('lists empty required settings of the block type', () => {
    expect(getMissingRequiredSettings(buildBlock())).toEqual(['rounds']);
    expect(getMissingRequiredSettings(buildBlock({ blockType: ProgramBlockType.Intervals, workSec: 20 }))).toEqual([
      'rounds',
    ]);
  });

  it('is empty once required settings are set or the type requires none', () => {
    expect(getMissingRequiredSettings(buildBlock({ rounds: 10 }))).toEqual([]);
    expect(getMissingRequiredSettings(buildBlock({ blockType: ProgramBlockType.ForTime }))).toEqual([]);
    expect(getMissingRequiredSettings(buildBlock({ blockType: ProgramBlockType.Strength }))).toEqual([]);
  });
});

describe('isDurationSetting', () => {
  it('treats every setting but rounds as a duration', () => {
    expect(isDurationSetting('rounds')).toBe(false);
    expect(isDurationSetting('restSec')).toBe(true);
  });
});
