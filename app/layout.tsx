import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { fontSans } from './fonts';
import './globals.css';
import { routing } from '@/i18n';
import { SITE_URL, cn, themeInlineScript } from '@/src/shared/lib';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// Extend content under the iPhone notch/home indicator so safe-area insets apply.
export const viewport: Viewport = {
  viewportFit: 'cover',
};

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
