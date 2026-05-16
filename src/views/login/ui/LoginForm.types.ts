import type { LoginValidationMessages } from '../model/schema';

export type LoginFormLabels = {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPasswordLabel: string;
  submitLabel: string;
  newToMentorix: string;
  createAccountLabel: string;
  loginSuccessMessage: string;
  loginErrorFallback: string;
};

export type LoginFormProps = {
  labels: LoginFormLabels;
  validation: LoginValidationMessages;
};
