import type { Program, ProgramDraftFields } from '../model/types';

export const toProgramDraftFields = (program: Program): ProgramDraftFields => ({
  name: program.name ?? '',
  nameRu: program.nameRu ?? '',
  description: program.description ?? '',
  descriptionRu: program.descriptionRu ?? '',
  category: program.category ?? '',
  difficulty: program.difficulty ?? '',
  previewImageUrl: program.previewImageUrl ?? '',
});
