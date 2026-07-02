import type { Difficulty } from '@/src/shared/types';

import type { UpdateProgramParams } from '../model/programs';
import type { Program, ProgramCategory, ProgramDraftFields } from '../model/types';

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
