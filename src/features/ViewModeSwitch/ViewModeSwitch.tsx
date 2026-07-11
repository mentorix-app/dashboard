'use client';

import { LayoutGrid, List } from 'lucide-react';

import { Button } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import type { ViewModeSwitchProps } from './ViewModeSwitch.types';

/**
 * Generic grid/list view toggle. Behaviour and layout live here; the caller
 * supplies the accessible labels for each mode.
 */
export const ViewModeSwitch = ({ value, onChange, labels }: ViewModeSwitchProps) => (
  <div className="bg-muted flex items-center gap-1 rounded-md p-1">
    <Button
      type="button"
      size="icon-xs"
      variant={value === 'grid' ? 'secondary' : 'ghost'}
      aria-pressed={value === 'grid'}
      aria-label={labels.grid}
      title={labels.grid}
      className={cn('size-7', value !== 'grid' && 'text-muted-foreground')}
      onClick={() => onChange('grid')}
    >
      <LayoutGrid className="size-4" />
    </Button>
    <Button
      type="button"
      size="icon-xs"
      variant={value === 'list' ? 'secondary' : 'ghost'}
      aria-pressed={value === 'list'}
      aria-label={labels.list}
      title={labels.list}
      className={cn('size-7', value !== 'list' && 'text-muted-foreground')}
      onClick={() => onChange('list')}
    >
      <List className="size-4" />
    </Button>
  </div>
);
