import { ProgramCategory, ProgramStatus } from '@/src/entities/program';
import type { ProgramSortField } from '@/src/entities/program';
import { Difficulty } from '@/src/shared/types';

export const PROGRAM_STATUS_OPTIONS: readonly ProgramStatus[] = [
  ProgramStatus.Draft,
  ProgramStatus.Published,
  ProgramStatus.Archived,
];

export const PROGRAM_CATEGORY_OPTIONS: readonly ProgramCategory[] = [
  ProgramCategory.WeightLoss,
  ProgramCategory.MuscleGain,
  ProgramCategory.Rehabilitation,
  ProgramCategory.Endurance,
  ProgramCategory.Functional,
];

export const PROGRAM_DIFFICULTY_OPTIONS: readonly Difficulty[] = [
  Difficulty.Beginner,
  Difficulty.Intermediate,
  Difficulty.Advanced,
  Difficulty.Expert,
];

export const PROGRAM_SORT_FIELDS: readonly ProgramSortField[] = [
  'name',
  'status',
  'category',
  'difficulty',
  'createdAt',
  'modifiedAt',
];
