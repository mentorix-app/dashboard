import * as z from 'zod';

export type ExerciseValidationMessages = {
  nameMin: string;
  descriptionMin: string;
  selectRequired: string;
  urlInvalid: string;
};

export function createExerciseSchema(messages: ExerciseValidationMessages) {
  const requiredSelect = z.string().trim().min(1, messages.selectRequired);
  const optionalUrl = z.union([z.literal(''), z.url({ message: messages.urlInvalid })]);

  return z.object({
    name: z.string().trim().min(2, messages.nameMin),
    nameRu: z.string().trim().min(2, messages.nameMin),
    description: z.string().trim().min(10, messages.descriptionMin),
    descriptionRu: z.string().trim().min(10, messages.descriptionMin),
    type: requiredSelect,
    muscleGroup: requiredSelect,
    equipment: z.string(),
    difficulty: requiredSelect,
    videoUrl: optionalUrl,
    previewImageUrl: optionalUrl,
  });
}
