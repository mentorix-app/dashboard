import Script from 'next/script';
import type { ReactNode } from 'react';

import { fontSans } from '@/app/fonts';
import '@/app/globals.css';
import { routing } from '@/i18n';
import { cn, themeInlineScript } from '@/src/shared/lib';

/**
 * Root layout owns <html>/<body> so the theme init script and font CSS are
 * hoisted by Next.js (required for `beforeInteractive`). The active locale is
 * applied to <html lang> client-side by HtmlLangSync inside the [locale] layout.
 */
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
