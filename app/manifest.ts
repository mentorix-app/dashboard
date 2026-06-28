import type { MetadataRoute } from 'next';

import { BRAND_NAVY } from '@/src/shared/brand/colors';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mentorix Dashboard',
    short_name: 'Mentorix',
    description: 'Mentorix admin dashboard for operating the platform.',
    start_url: '/',
    display: 'standalone',
    background_color: BRAND_NAVY,
    theme_color: BRAND_NAVY,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}
