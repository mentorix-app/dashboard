import { Inter } from 'next/font/google';

/** Single app font — change the import and options here only. */
export const fontSans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});
