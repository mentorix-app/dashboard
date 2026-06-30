'use client';

import { createContext, useContext, useMemo, type ComponentProps } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/src/shared/lib/styles';

type SortableItemContextValue = {
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
  setActivatorNodeRef: ReturnType<typeof useSortable>['setActivatorNodeRef'];
  isDragging: boolean;
};

const SortableItemContext = createContext<SortableItemContextValue | null>(null);

/**
 * Exposes the active item's drag activator so a nested handle can attach the
 * keyboard/pointer listeners. Throws when used outside a SortableItem so the
 * mistake surfaces in development rather than as a silent no-op.
 */
export const useSortableItem = (): SortableItemContextValue => {
  const context = useContext(SortableItemContext);
  if (!context) throw new Error('useSortableItem must be used within a SortableItem.');
  return context;
};

type SortableItemProps = ComponentProps<'div'> & {
  /** Must match an id passed to the parent Sortable's items list. */
  id: string;
};

export const SortableItem = ({ id, className, children, ...props }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const value = useMemo<SortableItemContextValue>(
    () => ({ attributes, listeners, setActivatorNodeRef, isDragging }),
    [attributes, listeners, setActivatorNodeRef, isDragging]
  );

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <SortableItemContext.Provider value={value}>
      <div ref={setNodeRef} style={style} className={cn(isDragging && 'z-10 opacity-60', className)} {...props}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
};
