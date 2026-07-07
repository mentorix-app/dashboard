'use client';

import { GripVertical } from 'lucide-react';

import { SortableItemHandle } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

type RowDragHandleProps = {
  /** Whether editing is allowed; read-only rows render an invisible spacer. */
  canEdit: boolean;
  /** Accessible label for the drag button (e.g. "Reorder block"). */
  label: string;
  className?: string;
};

/**
 * Drag activator for the surrounding sortable row or card. Renders a focusable
 * handle wired to dnd-kit when editing is allowed; otherwise an aligned spacer.
 * Must be rendered inside a SortableItem.
 */
export const RowDragHandle = ({ canEdit, label, className }: RowDragHandleProps) => {
  if (!canEdit) return <span aria-hidden className={cn('size-8', className)} />;

  return (
    <SortableItemHandle
      aria-label={label}
      className={cn(
        'text-muted-foreground inline-flex size-8 cursor-grab items-center justify-center rounded-md',
        'hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing',
        className
      )}
    >
      <GripVertical className="size-4" />
    </SortableItemHandle>
  );
};
