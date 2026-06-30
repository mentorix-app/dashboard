'use client';

import { type ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type SortableProps = {
  /** The ordered list of item ids currently rendered as children. */
  items: string[];
  /** Called with the new id order once a drag (mouse or keyboard) completes. */
  onReorder: (items: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
  children: ReactNode;
};

/**
 * Thin, accessible wrapper around dnd-kit's sortable primitives. Wires up
 * pointer + keyboard sensors so lists can be reordered with the mouse or the
 * keyboard (WCAG 2.2), and reports the resulting order via onReorder.
 */
export const Sortable = ({ items, onReorder, orientation = 'vertical', children }: SortableProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(String(active.id));
    const newIndex = items.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items}
        strategy={orientation === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
