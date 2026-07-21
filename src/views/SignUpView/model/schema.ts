import * as z from 'zod';

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};

export type SignupValidationMessages = {
  nameRequired: string;
  nameMinLength: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

export function createSignupSchema(messages: SignupValidationMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired).min(2, messages.nameMinLength),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .pipe(z.email({ message: messages.emailInvalid })),
    password: z.string().min(8, messages.passwordRequired),
  });
}
