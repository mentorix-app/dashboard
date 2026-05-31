'use client';

import { type ComponentProps } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '@/src/shared/lib/styles';

const SelectGroup = (props: ComponentProps<typeof SelectPrimitive.Group>) => (
  <SelectPrimitive.Group data-slot="select-group" {...props} />
);

const SelectValue = (props: ComponentProps<typeof SelectPrimitive.Value>) => (
  <SelectPrimitive.Value data-slot="select-value" {...props} />
);

const SelectLabel = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) => (
  <SelectPrimitive.Label
    data-slot="select-label"
    className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
    {...props}
  />
);

const SelectSeparator = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) => (
  <SelectPrimitive.Separator
    data-slot="select-separator"
    className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
    {...props}
  />
);

export { SelectGroup, SelectLabel, SelectSeparator, SelectValue };
