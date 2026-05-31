'use client';

import { type ComponentProps } from 'react';

import { cn } from '@/src/shared/lib/styles';
import { TooltipProvider } from '@/src/shared/ui/Tooltip';
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SidebarStateProvider } from './context';

type SidebarProviderProps = ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SidebarProvider = ({
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) => (
  <SidebarStateProvider defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    <TooltipProvider delayDuration={0}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', className)}
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  </SidebarStateProvider>
);

export { SidebarProvider };
