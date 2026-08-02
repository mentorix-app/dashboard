import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  // ESM-only packages (no CJS build); transpiling lets Jest's `next/jest`
  // preset transform them instead of hard-ignoring all of node_modules (see
  // config/jest.config.mjs testMatch comment / repo memory jest-gotchas.md).
  transpilePackages: ['jose', '@formatjs/intl-localematcher', '@formatjs/fast-memoize'],
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
