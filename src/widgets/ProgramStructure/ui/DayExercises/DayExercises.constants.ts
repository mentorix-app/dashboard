import { ProgramBlockType } from '@/src/entities/program';

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
