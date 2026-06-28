import type { ReactElement } from 'react';

import { BRAND_INK, BRAND_NAVY } from './colors';

/**
 * Mentorix brand mark (bar chart + ascending checkmark) as inline SVG.
 *
 * Rendered at build time by `next/og` (Satori) for the generated `apple-icon`
 * and social share images. For runtime/in-DOM branding use the `Logo` component
 * (which references the static SVG assets in `/public`).
 */
export const BrandMark = ({ size }: { size: number }): ReactElement => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="52" height="52" rx="14" fill={BRAND_NAVY} />
    <rect x="27" y="39" width="5" height="11" rx="1" fill="#0EA5E9" />
    <rect x="35" y="33" width="5" height="17" rx="1" fill="#38BDF8" />
    <rect x="43" y="25" width="5" height="25" rx="1" fill="#84CC16" />
    <path d="M18 45V23L31 36L47 20" stroke={BRAND_INK} strokeWidth="7" />
  </svg>
);
