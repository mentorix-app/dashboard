'use client';

import { LayoutGrid, List } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import type { ViewModeSwitchProps } from './ViewModeSwitch.types';

/**
 * Generic grid/list view toggle. Behaviour and layout live here; the caller
 * supplies the accessible labels for each mode.
 */
export const ViewModeSwitch = ({ value, onChange, labels }: ViewModeSwitchProps) => (
  <div className="bg-muted flex items-center gap-1 rounded-md p-1">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-xs"
          variant={value === 'grid' ? 'secondary' : 'ghost'}
          aria-pressed={value === 'grid'}
          aria-label={labels.grid}
          className={cn('size-7', value !== 'grid' && 'text-muted-foreground')}
          onClick={() => onChange('grid')}
        >
          <LayoutGrid className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{labels.grid}</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-xs"
          variant={value === 'list' ? 'secondary' : 'ghost'}
          aria-pressed={value === 'list'}
          aria-label={labels.list}
          className={cn('size-7', value !== 'list' && 'text-muted-foreground')}
          onClick={() => onChange('list')}
        >
          <List className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{labels.list}</TooltipContent>
    </Tooltip>
  </div>
);
