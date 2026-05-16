import Script from 'next/script';
import type { ReactNode } from 'react';
import { fontSans } from './fonts';
import './globals.css';
import { routing } from '@/i18n';
import { cn, themeInlineScript } from '@/src/shared/lib';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={routing.defaultLocale} className={cn('h-full antialiased', fontSans.variable)} suppressHydrationWarning>
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInlineScript }} />
        {children}
      </body>
    </html>
  );
}
