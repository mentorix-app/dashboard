import { EMPTY_BLOCK_SETTINGS } from '@/src/entities/program/model/blockSettings';
import { ProgramBlockType } from '@/src/entities/program/model/structure';

import { createBlockEditSchema } from '../BlockEditForm.schema';
import type { BlockEditFormValues, DurationInput } from '../BlockEditForm.types';

const schema = createBlockEditSchema({
  required: 'required',
  rounds: 'rounds',
  durationFormat: 'durationFormat',
  durationRange: 'durationRange',
  restRange: 'restRange',
});

const time = (minutes: string, seconds: string): DurationInput => ({ minutes, seconds });
const blank = time('', '');

const buildValues = (overrides: Partial<BlockEditFormValues> = {}): BlockEditFormValues => ({
  blockType: ProgramBlockType.SkillWork,
  instruction: '',
  rounds: '',
  durationSec: blank,
  timeCapSec: blank,
  workSec: blank,
  restSec: blank,
  ...overrides,
});

const issuesOf = (values: BlockEditFormValues) => {
  const result = schema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => [issue.path.join('.'), issue.message]);
};

describe('createBlockEditSchema', () => {
  it('trims the instruction and emits no settings for a session-part type', () => {
    expect(schema.parse(buildValues({ instruction: '  Move steadily  ', rounds: '5' }))).toEqual({
      blockType: ProgramBlockType.SkillWork,
      instruction: 'Move steadily',
      settings: EMPTY_BLOCK_SETTINGS,
    });
  });

  it('rejects the single block type', () => {
    expect(schema.safeParse({ ...buildValues(), blockType: 'single' }).success).toBe(false);
  });

  it('requires rounds for EMOM and superset, the duration for AMRAP and rounds plus work for intervals', () => {
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.Emom }))).toEqual([['rounds', 'required']]);
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.Superset }))).toEqual([['rounds', 'required']]);
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.Amrap }))).toEqual([['durationSec', 'required']]);
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.Intervals }))).toEqual([
      ['rounds', 'required'],
      ['workSec', 'required'],
    ]);
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.ForTime }))).toEqual([]);
  });

  it('reads times from minutes and seconds and outputs only the type settings', () => {
    expect(
      schema.parse(
        buildValues({
          blockType: ProgramBlockType.Intervals,
          rounds: '8',
          workSec: time('', '20'),
          restSec: time('0', '10'),
          durationSec: time('5', '0'),
        })
      ).settings
    ).toEqual({ ...EMPTY_BLOCK_SETTINGS, rounds: 8, workSec: 20, restSec: 10 });
    expect(
      schema.parse(buildValues({ blockType: ProgramBlockType.ForTime, timeCapSec: time('20', '') })).settings
    ).toEqual({ ...EMPTY_BLOCK_SETTINGS, timeCapSec: 1200 });
  });

  it('allows zero rest but no zero work, and enforces bounds', () => {
    const intervals: Partial<BlockEditFormValues> = {
      blockType: ProgramBlockType.Intervals,
      rounds: '8',
      workSec: time('0', '20'),
    };
    expect(issuesOf(buildValues({ ...intervals, restSec: time('0', '0') }))).toEqual([]);
    expect(issuesOf(buildValues({ ...intervals, workSec: time('0', '0') }))).toEqual([['workSec', 'durationRange']]);
    expect(issuesOf(buildValues({ ...intervals, restSec: time('1440', '1') }))).toEqual([['restSec', 'restRange']]);
    expect(issuesOf(buildValues({ ...intervals, rounds: '101' }))).toEqual([['rounds', 'rounds']]);
    expect(issuesOf(buildValues({ ...intervals, rounds: '0' }))).toEqual([['rounds', 'rounds']]);
  });

  it('reports malformed input', () => {
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.Emom, rounds: '2.5' }))).toEqual([['rounds', 'rounds']]);
    expect(issuesOf(buildValues({ blockType: ProgramBlockType.Amrap, durationSec: time('12', 'a') }))).toEqual([
      ['durationSec', 'durationFormat'],
    ]);
  });

  it('ignores invalid input in settings the selected type does not take', () => {
    expect(
      issuesOf(buildValues({ blockType: ProgramBlockType.Emom, rounds: '10', durationSec: time('x', 'y') }))
    ).toEqual([]);
  });
});
