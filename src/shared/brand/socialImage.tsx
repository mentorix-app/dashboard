import { ImageResponse } from 'next/og';

import { BrandMark } from './BrandMark';
import { BRAND_INK, BRAND_MUTED, BRAND_NAVY } from './colors';

/** Metadata for the generated Open Graph / Twitter share images. */
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };
export const SOCIAL_IMAGE_CONTENT_TYPE = 'image/png';
export const SOCIAL_IMAGE_ALT = 'Mentorix Dashboard';

/** Shared renderer for the Open Graph and Twitter social share images. */
export function renderBrandSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: BRAND_NAVY,
        color: BRAND_INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <BrandMark size={148} />
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -4 }}>Mentorix</div>
      </div>
      <div style={{ fontSize: 40, color: BRAND_MUTED }}>Admin dashboard for operating the platform</div>
    </div>,
    SOCIAL_IMAGE_SIZE
  );
}
