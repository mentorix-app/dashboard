import type { FooterLink } from './AuthFooter.types';

export const FOOTER_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Help Center', href: '/help' },
];

export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Mentorix. All rights reserved.`;
