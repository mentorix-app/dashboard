import * as z from 'zod';

export type EditableNameMessages = {
  nameRequired: string;
  nameMinLength: string;
};

export const createDisplayNameSchema = (messages: EditableNameMessages) =>
  z.object({
    name: z.string().trim().min(1, messages.nameRequired).min(2, messages.nameMinLength),
  });

export type DisplayNameValues = { name: string };
