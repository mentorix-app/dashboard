import { ROUTES, SUPPORT_MAILTO } from '@/src/shared/lib';
import type { FooterLink } from './AuthFooter.types';

/** Internal links go through the locale-aware `Link`; the contact is a plain mail link. */
export const FOOTER_LINKS: FooterLink[] = [
  { key: 'privacy', href: ROUTES.privacy, internal: true },
  { key: 'terms', href: ROUTES.terms, internal: true },
  { key: 'contact', href: SUPPORT_MAILTO, internal: false },
];
