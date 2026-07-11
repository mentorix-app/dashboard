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
