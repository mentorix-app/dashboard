import { ProgramBlockType } from '@/src/entities/program';

/**
 * Shared row layout for exercise rows (both top-level single rows and rows
 * inside a group block). On mobile the row is a small stacked card — a header
 * line (checkbox, drag handle, exercise name and row actions) with the editable
 * fields full width beneath it — so the inputs are not squeezed between the
 * handle and the actions menu. From the `md` breakpoint up the header switches
 * to `display: contents` and, together with per-cell `order`, the pieces
 * flatten back into a single aligned row.
 */
export const EXERCISE_ROW_LAYOUT = 'flex flex-col gap-2 md:flex-row md:items-center md:gap-2';

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
  [ProgramBlockType.SkillWork]: 'structure.blocks.types.skill_work',
  [ProgramBlockType.Strength]: 'structure.blocks.types.strength',
  [ProgramBlockType.Conditioning]: 'structure.blocks.types.conditioning',
  [ProgramBlockType.Gymnastics]: 'structure.blocks.types.gymnastics',
  [ProgramBlockType.Weightlifting]: 'structure.blocks.types.weightlifting',
} as const;
