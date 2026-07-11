import type { Program } from '../model/types';

/**
 * Resolves the program description for the active locale, falling back to the
 * other locale so a card never renders blank when only one language is filled.
 */
export const getProgramDescription = (
  program: Pick<Program, 'description' | 'descriptionRu'>,
  locale: string
): string => {
  const isRu = locale.startsWith('ru');
  return isRu ? program.descriptionRu || program.description : program.description || program.descriptionRu;
};
