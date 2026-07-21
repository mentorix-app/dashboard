'use client';

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/shared/ui';

import type { SortMenuProps } from './SortOrderControl.types';

/**
 * Multi-field sort control styled like `SortOrderControl`. The trigger shows the
 * active field with an order arrow; clicking it opens a dropdown of the available
 * fields. Selecting a field applies it; reselecting the active field toggles order.
 */
export const SortMenu = <TField extends string>({ field, order, options, onSelect, label }: SortMenuProps<TField>) => {
  const OrderIcon = order === 'asc' ? ArrowUpNarrowWide : ArrowDownWideNarrow;
  const activeOption = options.find((option) => option.field === field);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" aria-label={label} title={label}>
          <OrderIcon className="size-4" />
          {activeOption ? activeOption.label : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {options.map((option) => {
          const isActive = option.field === field;
          return (
            <DropdownMenuItem
              key={option.field}
              aria-current={isActive}
              className="justify-between gap-6"
              onSelect={() => onSelect(option.field)}
            >
              {option.label}
              {isActive ? <OrderIcon className="size-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
