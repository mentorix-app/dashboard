import { ImageResponse } from 'next/og';

import { BRAND_NAVY, BrandMark } from '@/src/shared/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BRAND_NAVY,
      }}
    >
      <BrandMark size={132} />
    </div>,
    size
  );
}
