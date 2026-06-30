'use client';

import { GripVertical, Trash2 } from 'lucide-react';

import { Button, SortableItem, SortableItemHandle, Typography } from '@/src/shared/ui';

import type { DayColumnProps } from './DayColumn.types';

export const DayColumn = ({ id, label, deleteLabel, reorderLabel, exercisesPlaceholder, onDelete }: DayColumnProps) => (
  <SortableItem id={id} className="bg-card flex w-56 shrink-0 flex-col rounded-md border">
    <div className="border-border flex items-center gap-1 border-b px-1 py-1">
      <SortableItemHandle
        aria-label={reorderLabel}
        className="text-muted-foreground focus-visible:ring-ring/50 flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md outline-none focus-visible:ring-2 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </SortableItemHandle>

      <Typography variant="p-sm" className="flex-1 px-1 font-medium">
        {label}
      </Typography>

      <Button type="button" variant="ghost" size="icon-sm" aria-label={deleteLabel} onClick={onDelete}>
        <Trash2 className="size-4" />
      </Button>
    </div>

    <div className="flex min-h-40 flex-1 items-center justify-center p-3">
      <Typography variant="p-sm" className="text-muted-foreground text-center">
        {exercisesPlaceholder}
      </Typography>
    </div>
  </SortableItem>
);
