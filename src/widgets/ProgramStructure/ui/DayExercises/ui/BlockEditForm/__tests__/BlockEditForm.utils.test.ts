import { EMPTY_BLOCK_SETTINGS } from '@/src/entities/program/model/blockSettings';
import { ProgramBlockType, type ProgramDayBlock } from '@/src/entities/program/model/structure';

import {
  normalizeDurationInput,
  parseDurationInput,
  parseRoundsInput,
  toBlockEditFormValues,
  toDurationInput,
} from '../BlockEditForm.utils';

const buildBlock = (overrides: Partial<ProgramDayBlock> = {}): ProgramDayBlock => ({
  id: 'block-1',
  blockType: ProgramBlockType.Intervals,
  instruction: 'Hold the pace',
  sortOrder: 1,
  clientUserIds: [],
  exercises: [],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
  ...overrides,
});

describe('parseRoundsInput', () => {
  it('reads whole numbers within 1..100', () => {
    expect(parseRoundsInput(' 12 ')).toEqual({ ok: true, value: 12 });
    expect(parseRoundsInput('')).toEqual({ ok: true, value: null });
    expect(parseRoundsInput('1.5')).toEqual({ ok: false, reason: 'format' });
    expect(parseRoundsInput('0')).toEqual({ ok: false, reason: 'range' });
  });
});

describe('parseDurationInput', () => {
  it('combines minutes and seconds, treating one blank part as zero', () => {
    expect(parseDurationInput('durationSec', { minutes: '12', seconds: '' })).toEqual({ ok: true, value: 720 });
    expect(parseDurationInput('restSec', { minutes: '', seconds: '20' })).toEqual({ ok: true, value: 20 });
    expect(parseDurationInput('workSec', { minutes: '0', seconds: '90' })).toEqual({ ok: true, value: 90 });
    expect(parseDurationInput('workSec', { minutes: ' ', seconds: '' })).toEqual({ ok: true, value: null });
  });

  it('keeps bounds per field: rest may be zero, other times may not', () => {
    expect(parseDurationInput('restSec', { minutes: '0', seconds: '0' })).toEqual({ ok: true, value: 0 });
    expect(parseDurationInput('workSec', { minutes: '0', seconds: '0' })).toEqual({ ok: false, reason: 'range' });
    expect(parseDurationInput('timeCapSec', { minutes: '1440', seconds: '1' })).toEqual({ ok: false, reason: 'range' });
  });

  it('rejects parts that are not whole numbers', () => {
    expect(parseDurationInput('durationSec', { minutes: '1.5', seconds: '' })).toEqual({ ok: false, reason: 'format' });
    expect(parseDurationInput('durationSec', { minutes: '1', seconds: '-5' })).toEqual({ ok: false, reason: 'format' });
  });
});

describe('toDurationInput', () => {
  it('splits stored seconds into the two inputs', () => {
    expect(toDurationInput(null)).toEqual({ minutes: '', seconds: '' });
    expect(toDurationInput(20)).toEqual({ minutes: '0', seconds: '20' });
    expect(toDurationInput(720)).toEqual({ minutes: '12', seconds: '0' });
  });
});

describe('normalizeDurationInput', () => {
  it('fills a blank part with zero and carries extra seconds into minutes', () => {
    expect(normalizeDurationInput('restSec', { minutes: '', seconds: '20' })).toEqual({ minutes: '0', seconds: '20' });
    expect(normalizeDurationInput('workSec', { minutes: '0', seconds: '90' })).toEqual({ minutes: '1', seconds: '30' });
    expect(normalizeDurationInput('workSec', { minutes: '', seconds: '' })).toEqual({ minutes: '', seconds: '' });
  });

  it('leaves malformed input for the user to fix', () => {
    expect(normalizeDurationInput('workSec', { minutes: 'a', seconds: '5' })).toEqual({ minutes: 'a', seconds: '5' });
  });
});

describe('toBlockEditFormValues', () => {
  it('prefills the form from the block, coercing a non-group type to skill work', () => {
    expect(toBlockEditFormValues(buildBlock({ rounds: 8, workSec: 20, restSec: 0 }))).toEqual({
      blockType: ProgramBlockType.Intervals,
      instruction: 'Hold the pace',
      rounds: '8',
      durationSec: { minutes: '', seconds: '' },
      timeCapSec: { minutes: '', seconds: '' },
      workSec: { minutes: '0', seconds: '20' },
      restSec: { minutes: '0', seconds: '0' },
    });
    expect(toBlockEditFormValues(buildBlock({ blockType: ProgramBlockType.Single })).blockType).toBe(
      ProgramBlockType.SkillWork
    );
  });
});
