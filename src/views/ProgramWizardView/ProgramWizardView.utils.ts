import { PROGRAM_REQUIRED_FIELDS } from './ProgramWizardView.constants';
import type { ProgramRequiredField, ProgramWizardStep } from './ProgramWizardView.types';

type ProgramRequiredSource = Partial<Record<ProgramRequiredField, string | null>>;

export const resolveStep = (pathname: string): ProgramWizardStep =>
  pathname.endsWith('/structure') ? 'structure' : 'basics';

const isFieldFilled = (value: string | null | undefined): boolean => {
  if (value == null) return false;
  return value.trim().length > 0;
};

/**
 * Returns the required fields that are still empty. When the source has not
 * loaded yet, every field counts as missing so progress starts at 0%. Accepts
 * either a persisted program or the live draft fields from the store.
 */
export const getMissingRequiredFields = (source?: ProgramRequiredSource): ProgramRequiredField[] => {
  if (!source) return [...PROGRAM_REQUIRED_FIELDS];
  return PROGRAM_REQUIRED_FIELDS.filter((field) => !isFieldFilled(source[field]));
};

export const getCompletionPercent = (source?: ProgramRequiredSource): number => {
  const total = PROGRAM_REQUIRED_FIELDS.length;
  const missing = getMissingRequiredFields(source).length;
  return Math.round(((total - missing) / total) * 100);
};
