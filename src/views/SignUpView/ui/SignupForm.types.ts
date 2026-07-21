import type { SignupValidationMessages } from '../model/schema';

export type SignupFormLabels = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
  alreadyHaveAccount: string;
  signInLabel: string;
  signupSuccessMessage: string;
  signupErrorFallback: string;
};

export type SignupFormProps = {
  labels: SignupFormLabels;
  validation: SignupValidationMessages;
};
