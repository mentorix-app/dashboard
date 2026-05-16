'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useIsMobile } from '@/src/shared/hooks';

export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '15rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '4.5rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export type SidebarState = 'expanded' | 'collapsed';

export type SidebarContextValue = {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
};

type SidebarProviderProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export const SidebarStateProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
}: SidebarProviderProps) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (setOpenProp) {
        setOpenProp(value);
      } else {
        setInternalOpen(value);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp]
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
      return;
    }
    setOpen(!open);
  }, [isMobile, open, setOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state: SidebarState = open ? 'expanded' : 'collapsed';

  const value = useMemo<SidebarContextValue>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
