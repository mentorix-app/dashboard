import { Inter, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { routing } from '@/i18n';
import './globals.css';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const headersList = await headers();
  const locale =
    headersList.get('x-next-intl-locale') ?? headersList.get('X-NEXT-INTL-LOCALE') ?? routing.defaultLocale;

  return (
    <html lang={locale} className={`${inter.variable} ${geistMono.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
