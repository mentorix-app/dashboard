export type ProgramBasicsOption = { value: string; label: string };

export const buildOptions = <T extends string>(
  values: readonly T[],
  getLabel: (value: T) => string
): ProgramBasicsOption[] => values.map((value) => ({ value, label: getLabel(value) }));
