import { EMPTY_BLOCK_SETTINGS } from '@/src/entities/program/model/blockSettings';
import {
  ProgramBlockType,
  type ProgramDayBlock,
  type ProgramDayExercise,
} from '@/src/entities/program/model/structure';

import { countExercisesLosingSets, moveDropsSets } from '../lib/blockSets';
import { getBlockSettingChips, getDurationLabel } from '../lib/blockSettingsSummary';
import { getBlockTypeLabelKey } from '../lib/blockTypeLabel';

const buildExercise = (id: string, sets: string | null): ProgramDayExercise => ({
  id,
  exerciseId: `${id}-def`,
  exerciseName: id,
  exerciseNameRu: id,
  sortOrder: 1,
  sets,
  reps: '10',
  instruction: '',
  createdAt: '2026-10-25T00:00:00Z',
});

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

describe('getBlockSettingChips', () => {
  it('describes each set value of the type in display order', () => {
    expect(getBlockSettingChips(buildBlock({ rounds: 10 }))).toEqual([{ kind: 'rounds', count: 10 }]);
    expect(getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.Amrap, durationSec: 720 }))).toEqual([
      { kind: 'duration', seconds: 720 },
    ]);
    expect(
      getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.ForTime, rounds: 5, timeCapSec: 1200 }))
    ).toEqual([
      { kind: 'rounds', count: 5 },
      { kind: 'timeCap', seconds: 1200 },
    ]);
    expect(
      getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.Intervals, rounds: 8, workSec: 20, restSec: 10 }))
    ).toEqual([
      { kind: 'rounds', count: 8 },
      { kind: 'work', seconds: 20 },
      { kind: 'rest', seconds: 10 },
    ]);
  });

  it('shows zero rest as "no rest"', () => {
    expect(
      getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.Intervals, rounds: 8, workSec: 20, restSec: 0 }))
    ).toContainEqual({ kind: 'noRest' });
  });

  it('flags empty required settings and skips empty optional ones', () => {
    expect(getBlockSettingChips(buildBlock())).toEqual([{ kind: 'missing', field: 'rounds' }]);
    expect(getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.ForTime }))).toEqual([]);
    expect(getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.Intervals, rounds: 4 }))).toEqual([
      { kind: 'rounds', count: 4 },
      { kind: 'missing', field: 'workSec' },
    ]);
  });

  it('ignores settings the type does not take and types without settings', () => {
    expect(getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.Strength, rounds: 3 }))).toEqual([]);
    expect(getBlockSettingChips(buildBlock({ blockType: ProgramBlockType.Emom, rounds: 6, durationSec: 60 }))).toEqual([
      { kind: 'rounds', count: 6 },
    ]);
  });
});

describe('countExercisesLosingSets', () => {
  const block = buildBlock({
    blockType: ProgramBlockType.Strength,
    exercises: [buildExercise('a', '3'), buildExercise('b', null), buildExercise('c', '5/4')],
  });

  it('counts exercises with sets when the new type has none', () => {
    expect(countExercisesLosingSets(block, ProgramBlockType.Emom)).toBe(2);
  });

  it('is zero when the new type keeps sets', () => {
    expect(countExercisesLosingSets(block, ProgramBlockType.SkillWork)).toBe(0);
  });
});

describe('moveDropsSets', () => {
  const blocks = [
    buildBlock({ id: 'single', blockType: ProgramBlockType.Single, exercises: [buildExercise('with-sets', '3')] }),
    buildBlock({ id: 'emom', blockType: ProgramBlockType.Emom, exercises: [buildExercise('no-sets', null)] }),
    buildBlock({ id: 'strength', blockType: ProgramBlockType.Strength }),
  ];

  it('is true when an exercise with sets moves into a block type without sets', () => {
    expect(moveDropsSets(blocks, 'single', 'with-sets', 'emom')).toBe(true);
  });

  it('is false when the target keeps sets or the exercise has none', () => {
    expect(moveDropsSets(blocks, 'single', 'with-sets', 'strength')).toBe(false);
    expect(moveDropsSets(blocks, 'emom', 'no-sets', 'strength')).toBe(false);
    expect(moveDropsSets(blocks, 'single', 'missing', 'emom')).toBe(false);
  });
});

describe('getDurationLabel', () => {
  it('says seconds, whole minutes, or both', () => {
    expect(getDurationLabel(20)).toEqual({ unit: 'seconds', seconds: 20 });
    expect(getDurationLabel(720)).toEqual({ unit: 'minutes', minutes: 12 });
    expect(getDurationLabel(90)).toEqual({ unit: 'minutesSeconds', minutes: 1, seconds: 30 });
  });
});

describe('getBlockTypeLabelKey', () => {
  it('maps known types, reads removed ones as skill work and falls back for anything else', () => {
    expect(getBlockTypeLabelKey(ProgramBlockType.Emom)).toBe('structure.blocks.types.emom');
    expect(getBlockTypeLabelKey('complex')).toBe('structure.blocks.types.skill_work');
    expect(getBlockTypeLabelKey('mystery')).toBe('structure.blocks.types.unknown');
  });
});
