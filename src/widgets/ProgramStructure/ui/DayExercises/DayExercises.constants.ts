import { ProgramBlockType } from '@/src/entities/program';

/**
 * Grid template for top-level single-exercise rows: a merge checkbox, drag
 * handle, exercise name, sets, reps, instruction and the row actions. The sets
 * and reps columns carry their own inline labels, so they are a touch wider.
 */
export const SINGLE_ROW_GRID =
  'grid grid-cols-[2rem_2rem_minmax(8rem,1.5fr)_6rem_6rem_minmax(8rem,2fr)_2.25rem] items-center gap-2';

/**
 * Grid template for exercise rows inside a group block: same as single rows but
 * without the merge checkbox column (a grouped exercise cannot start a merge).
 */
export const GROUP_ROW_GRID =
  'grid grid-cols-[2rem_minmax(8rem,1.5fr)_6rem_6rem_minmax(8rem,2fr)_2.25rem] items-center gap-2';

/** Message keys for each block type label, kept literal so next-intl stays typed. */
export const BLOCK_TYPE_LABEL_KEY = {
  [ProgramBlockType.Single]: 'structure.blocks.types.single',
  [ProgramBlockType.Emom]: 'structure.blocks.types.emom',
  [ProgramBlockType.Amrap]: 'structure.blocks.types.amrap',
  [ProgramBlockType.ForTime]: 'structure.blocks.types.for_time',
  [ProgramBlockType.Intervals]: 'structure.blocks.types.intervals',
  [ProgramBlockType.Chipper]: 'structure.blocks.types.chipper',
  [ProgramBlockType.Ladder]: 'structure.blocks.types.ladder',
  [ProgramBlockType.DeathBy]: 'structure.blocks.types.death_by',
  [ProgramBlockType.Superset]: 'structure.blocks.types.superset',
  [ProgramBlockType.Complex]: 'structure.blocks.types.complex',
} as const;
