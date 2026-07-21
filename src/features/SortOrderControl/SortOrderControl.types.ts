import type { LucideIcon } from 'lucide-react';

export type SortOrder = 'asc' | 'desc';

export type SortOrderControlProps = {
  order: SortOrder;
  onOrderChange: (order: SortOrder) => void;
  labels: {
    /** Accessible label for the control as a whole. */
    label: string;
    asc: string;
    desc: string;
  };
  /** Icon shown while ascending; defaults to a generic ascending arrow. */
  ascIcon?: LucideIcon;
  /** Icon shown while descending; defaults to a generic descending arrow. */
  descIcon?: LucideIcon;
};

export type SortOption<TField extends string = string> = {
  field: TField;
  label: string;
};

export type SortMenuProps<TField extends string = string> = {
  /** Active sort field; null when nothing is selected. */
  field: TField | null;
  order: SortOrder;
  options: readonly SortOption<TField>[];
  /** Called with the chosen field; reselecting the active field toggles the order. */
  onSelect: (field: TField) => void;
  /** Trigger/menu label, also used as the fallback when no field is active. */
  label: string;
};
