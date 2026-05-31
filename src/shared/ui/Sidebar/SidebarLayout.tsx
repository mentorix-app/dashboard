'use client';

import { type ComponentProps } from 'react';

import { cn } from '@/src/shared/lib/styles';

const SidebarInset = ({ className, ...props }: ComponentProps<'main'>) => (
  <main
    data-slot="sidebar-inset"
    className={cn(
      'bg-background relative flex w-full flex-1 flex-col',
      'md:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
      className
    )}
    {...props}
  />
);

const SidebarHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-header"
    data-sidebar="header"
    className={cn('flex flex-col gap-2 p-2', className)}
    {...props}
  />
);

const SidebarFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-footer"
    data-sidebar="footer"
    className={cn('flex flex-col gap-2 p-2', className)}
    {...props}
  />
);

const SidebarSeparator = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-separator"
    data-sidebar="separator"
    className={cn('bg-sidebar-border mx-2 h-px w-auto', className)}
    {...props}
  />
);

const SidebarContent = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-content"
    data-sidebar="content"
    className={cn(
      'flex min-h-0 flex-1 flex-col gap-2 overflow-hidden group-data-[collapsible=icon]:overflow-hidden',
      className
    )}
    {...props}
  />
);

const SidebarGroup = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-group"
    data-sidebar="group"
    className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
    {...props}
  />
);

const SidebarGroupLabel = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-group-label"
    data-sidebar="group-label"
    className={cn(
      'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
      className
    )}
    {...props}
  />
);

const SidebarGroupContent = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="sidebar-group-content"
    data-sidebar="group-content"
    className={cn('w-full text-sm', className)}
    {...props}
  />
);

export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarSeparator,
};
