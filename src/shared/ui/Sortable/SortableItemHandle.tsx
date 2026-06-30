'use client';

import { type ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { useSortableItem } from './SortableItem';

type SortableItemHandleProps = ComponentProps<'button'> & {
  asChild?: boolean;
};

/**
 * Drag activator for the surrounding SortableItem. Renders a button by default
 * (so it is keyboard-focusable); pass asChild to project the listeners onto a
 * custom element. Always provide an accessible label via aria-label.
 */
export const SortableItemHandle = ({ asChild = false, ...props }: SortableItemHandleProps) => {
  const { attributes, listeners, setActivatorNodeRef } = useSortableItem();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp ref={setActivatorNodeRef} type={asChild ? undefined : 'button'} {...attributes} {...listeners} {...props} />
  );
};
