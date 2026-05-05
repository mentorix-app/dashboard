import * as z from 'zod';

export type LoginFormValues = {
  username: string;
  password: string;
};

export type LoginValidationMessages = {
  usernameRequired: string;
  usernameMinLength: string;
  passwordRequired: string;
};

export function createLoginSchema(messages: LoginValidationMessages) {
  return z.object({
    username: z.string().trim().min(1, messages.usernameRequired).min(3, messages.usernameMinLength),
    password: z.string().min(1, messages.passwordRequired),
  });
}
