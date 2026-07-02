import type { Program } from '../model/types';

/**
 * Resolves the program name for the active locale, falling back to the other
 * locale so a row/title never renders blank when only one language is filled.
 */
export const getProgramName = (program: Pick<Program, 'name' | 'nameRu'>, locale: string): string => {
  const isRu = locale.startsWith('ru');
  return isRu ? program.nameRu || program.name : program.name || program.nameRu;
};
