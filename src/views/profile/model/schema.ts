import * as z from 'zod';

export type ProfileFormValues = {
  name: string;
};

export type ProfileValidationMessages = {
  nameRequired: string;
  nameMinLength: string;
};

export function createProfileSchema(messages: ProfileValidationMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired).min(2, messages.nameMinLength),
  });
}
