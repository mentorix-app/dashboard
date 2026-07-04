import type { ProfileValidationMessages } from '../model/schema';

export type ProfileFormLabels = {
  displayedNameLabel: string;
  displayedNamePlaceholder: string;
  saveLabel: string;
};

export type ProfileFormMessages = {
  updateSuccess: string;
  updateError: string;
};

export type ProfileFormProps = {
  defaultName: string;
  labels: ProfileFormLabels;
  validation: ProfileValidationMessages;
  messages: ProfileFormMessages;
};
