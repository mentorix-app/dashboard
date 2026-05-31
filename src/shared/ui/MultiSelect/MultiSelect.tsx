'use client';

import { useEffect, useRef, useState, type FC } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/src/shared/lib/styles';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import type { MultiSelectProps } from './MultiSelect.types';

export const MultiSelect: FC<MultiSelectProps> = ({
  value,
  options,
  placeholder,
  ariaLabel,
  id,
  onValueChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = new Set(value);
  const selectedLabels = options.filter((option) => selected.has(option.value)).map((option) => option.label);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    const next = new Set(value);
    if (checked) {
      next.add(optionValue);
    } else {
      next.delete(optionValue);
    }

    onValueChange(Array.from(next));
  };

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <Button
        type="button"
        id={id}
        variant="outline"
        className="w-full justify-between font-normal"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={cn('truncate', selectedLabels.length === 0 && 'text-muted-foreground')}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDownIcon aria-hidden className="opacity-50" />
      </Button>
      {isOpen ? (
        <div className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 max-h-72 w-full min-w-56 overflow-y-auto rounded-md border p-1 shadow-md">
          {options.map((option) => {
            const id = `${ariaLabel}-${option.value}`;

            return (
              <label
                key={option.value}
                htmlFor={id}
                className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
              >
                <Checkbox
                  id={id}
                  checked={selected.has(option.value)}
                  onCheckedChange={(checked) => handleOptionChange(option.value, checked === true)}
                />
                <span className="truncate">{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
