import { GROUP_BLOCK_TYPES, ProgramBlockType, type ProgramBlockGroupType } from '@/src/entities/program';

/** Coerce an arbitrary block-type string into a valid group type (default: Complex). */
export const toGroupType = (value: string): ProgramBlockGroupType =>
  GROUP_BLOCK_TYPES.find((type) => type === value) ?? ProgramBlockType.Complex;
