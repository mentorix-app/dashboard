import { ProgramCategory } from '@/src/entities/program';
import { DIFFICULTY_OPTIONS } from '@/src/shared/types';

import type { ProgramBasicsFormValues } from './ProgramBasicsForm.types';

export const PROGRAM_BASICS_DEFAULT_VALUES: ProgramBasicsFormValues = {
  name: '',
  nameRu: '',
  description: '',
  descriptionRu: '',
  category: '',
  difficulty: '',
  previewImageUrl: '',
};

export const PROGRAM_CATEGORY_VALUES: readonly ProgramCategory[] = [
  ProgramCategory.WeightLoss,
  ProgramCategory.MuscleGain,
  ProgramCategory.Rehabilitation,
  ProgramCategory.Endurance,
  ProgramCategory.Functional,
];

export const PROGRAM_DIFFICULTY_VALUES = DIFFICULTY_OPTIONS;

export const AUTOSAVE_DELAY_MS = 600;

export const PUBLISH_VALIDATE_PARAM = 'validate';
