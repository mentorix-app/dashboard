import * as z from 'zod';

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginValidationMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

export function createLoginSchema(messages: LoginValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .pipe(z.email({ message: messages.emailInvalid })),
    password: z.string().min(8, messages.passwordRequired),
  });
}
