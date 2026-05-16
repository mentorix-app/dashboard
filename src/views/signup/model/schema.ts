import * as z from 'zod';

export type SignupFormValues = {
  email: string;
  password: string;
};

export type SignupValidationMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

export function createSignupSchema(messages: SignupValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .pipe(z.email({ message: messages.emailInvalid })),
    password: z.string().min(8, messages.passwordRequired),
  });
}
