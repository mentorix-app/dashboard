export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectProps = {
  value: readonly string[];
  options: readonly MultiSelectOption[];
  placeholder: string;
  ariaLabel: string;
  id?: string;
  onValueChange: (value: string[]) => void;
  className?: string;
};
