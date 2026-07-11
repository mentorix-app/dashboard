'use client';

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

import { Button } from '@/src/shared/ui';

import type { SortOrderControlProps } from './SortOrderControl.types';

/**
 * Generic ascending/descending sort toggle. Behaviour lives here; the caller
 * supplies the labels and, optionally, order-specific icons (e.g. A–Z arrows).
 */
export const SortOrderControl = ({
  order,
  onOrderChange,
  labels,
  ascIcon: AscIcon = ArrowUpNarrowWide,
  descIcon: DescIcon = ArrowDownWideNarrow,
}: SortOrderControlProps) => {
  const isAsc = order === 'asc';

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={labels.label}
      title={labels.label}
      onClick={() => onOrderChange(isAsc ? 'desc' : 'asc')}
    >
      {isAsc ? <AscIcon className="size-4" /> : <DescIcon className="size-4" />}
      {isAsc ? labels.asc : labels.desc}
    </Button>
  );
};
