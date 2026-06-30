import type { Difficulty } from '@/src/shared/types';

import type { UpdateProgramParams } from '../api/programs.types';
import type { Program, ProgramCategory, ProgramDraftFields } from './types';

/**
 * Resolves the program name for the active locale, falling back to the other
 * locale so a row/title never renders blank when only one language is filled.
 */
export const getProgramName = (program: Pick<Program, 'name' | 'nameRu'>, locale: string): string => {
  const isRu = locale.startsWith('ru');
  return isRu ? program.nameRu || program.name : program.name || program.nameRu;
};

export const toProgramDraftFields = (program: Program): ProgramDraftFields => ({
  name: program.name ?? '',
  nameRu: program.nameRu ?? '',
  description: program.description ?? '',
  descriptionRu: program.descriptionRu ?? '',
  category: program.category ?? '',
  difficulty: program.difficulty ?? '',
  previewImageUrl: program.previewImageUrl ?? '',
});

/**
 * Diffs the draft fields against the persisted program and returns only the
 * fields that actually changed, so saves never send redundant writes.
 */
export const buildProgramPatch = (fields: ProgramDraftFields, program: Program): UpdateProgramParams => {
  const patch: UpdateProgramParams = {};

  const name = fields.name.trim();
  const nameRu = fields.nameRu.trim();
  const description = fields.description.trim();
  const descriptionRu = fields.descriptionRu.trim();
  const previewImageUrl = fields.previewImageUrl.trim();

  if (name !== (program.name ?? '')) patch.name = name;
  if (nameRu !== (program.nameRu ?? '')) patch.nameRu = nameRu;
  if (description !== (program.description ?? '')) patch.description = description;
  if (descriptionRu !== (program.descriptionRu ?? '')) patch.descriptionRu = descriptionRu;
  if (previewImageUrl !== (program.previewImageUrl ?? '')) patch.previewImageUrl = previewImageUrl;
  if (fields.category !== '' && fields.category !== program.category) {
    patch.category = fields.category as ProgramCategory;
  }
  if (fields.difficulty !== '' && fields.difficulty !== program.difficulty) {
    patch.difficulty = fields.difficulty as Difficulty;
  }

  return patch;
};

export const isProgramDirty = (fields: ProgramDraftFields, program: Program): boolean =>
  Object.keys(buildProgramPatch(fields, program)).length > 0;
