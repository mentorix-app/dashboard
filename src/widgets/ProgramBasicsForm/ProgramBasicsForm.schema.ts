import * as z from 'zod';

export type ProgramBasicsValidationMessages = {
  nameRequired: string;
  descriptionRequired: string;
  selectRequired: string;
};

export const createProgramBasicsSchema = (messages: ProgramBasicsValidationMessages) =>
  z.object({
    name: z.string().trim().min(1, messages.nameRequired),
    nameRu: z.string().trim().min(1, messages.nameRequired),
    description: z.string().trim().min(1, messages.descriptionRequired),
    descriptionRu: z.string().trim().min(1, messages.descriptionRequired),
    category: z.string().trim().min(1, messages.selectRequired),
    difficulty: z.string().trim().min(1, messages.selectRequired),
    previewImageUrl: z.string().trim(),
  });
