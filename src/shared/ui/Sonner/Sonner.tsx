'use client';

import { type ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { useResolvedTheme } from '@/src/shared/hooks';

const Toaster = (props: ComponentProps<typeof SonnerToaster>) => {
  const theme = useResolvedTheme();

  return <SonnerToaster theme={theme} position="top-right" richColors closeButton {...props} />;
};

export { Toaster };
