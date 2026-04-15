import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { routing } from '@/i18n';
import { themeInlineScript } from '@/lib/theme-inline-script';
import { fontSans } from './fonts';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const headersList = await headers();
  const locale =
    headersList.get('x-next-intl-locale') ?? headersList.get('X-NEXT-INTL-LOCALE') ?? routing.defaultLocale;

  return (
    <html
      lang={locale}
      className={cn('h-full', 'antialiased', fontSans.variable, 'font-sans', inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInlineScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
