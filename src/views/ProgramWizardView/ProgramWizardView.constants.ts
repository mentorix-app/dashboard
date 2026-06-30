import type { ProgramRequiredField, ProgramWizardStep } from './ProgramWizardView.types';

export const PROGRAM_WIZARD_STEPS: readonly ProgramWizardStep[] = ['basics', 'structure'];

export const PROGRAM_REQUIRED_FIELDS: readonly ProgramRequiredField[] = [
  'name',
  'nameRu',
  'description',
  'descriptionRu',
  'category',
  'difficulty',
  'previewImageUrl',
];
