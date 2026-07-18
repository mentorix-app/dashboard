/** Renders a plan limit, mapping the backend's `null` (unlimited) to a label. */
export const formatLimit = (value: number | null, unlimitedLabel: string): string =>
  value === null ? unlimitedLabel : String(value);
