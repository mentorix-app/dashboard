'use client';

import { GripVertical, Trash2 } from 'lucide-react';

import { Button, SortableItem, SortableItemHandle, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import type { WeekItemProps } from './WeekItem.types';

export const WeekItem = ({
  id,
  label,
  selectLabel,
  deleteLabel,
  reorderLabel,
  isSelected,
  onSelect,
  onDelete,
}: WeekItemProps) => (
  <SortableItem
    id={id}
    className={cn(
      'bg-card flex items-center gap-1 rounded-md border border-transparent px-1 transition-colors',
      isSelected ? 'border-border bg-muted' : 'hover:bg-muted/60'
    )}
  >
    <SortableItemHandle
      aria-label={reorderLabel}
      className="text-muted-foreground focus-visible:ring-ring/50 flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md outline-none focus-visible:ring-2 active:cursor-grabbing"
    >
      <GripVertical className="size-4" />
    </SortableItemHandle>

    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={selectLabel}
      className="focus-visible:ring-ring/50 flex-1 rounded-md px-2 py-2 text-left outline-none focus-visible:ring-2"
    >
      <Typography variant="p-sm" className="font-medium">
        {label}
      </Typography>
    </button>

    <Button type="button" variant="ghost" size="icon-sm" aria-label={deleteLabel} onClick={onDelete}>
      <Trash2 className="size-4" />
    </Button>
  </SortableItem>
);
