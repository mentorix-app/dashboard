import { type Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { SITE_NAME, SITE_URL } from '@/src/shared/lib';
import { HtmlLangSync } from '@/src/shared/ui';

import { AppPreviewSection } from './ui/AppPreviewSection';
import { FeaturesSection } from './ui/FeaturesSection';
import { FinalCtaSection } from './ui/FinalCtaSection';
import { HowItWorksSection } from './ui/HowItWorksSection';
import { LandingFooter } from './ui/LandingFooter';
import { LandingHeader } from './ui/LandingHeader';
import { HeroSection } from './ui/HeroSection';
import { MobileAppSection } from './ui/MobileAppSection';
import { PricingSection } from './ui/PricingSection';

type LandingViewProps = {
  locale: Locale;
};

export async function LandingView({ locale }: LandingViewProps) {
  const t = await getTranslations({ locale, namespace: 'Landing' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/mini-logo.svg`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: locale,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: t('jsonLd.category'),
        operatingSystem: 'Web',
        description: t('meta.description'),
        url: SITE_URL,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <HtmlLangSync />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a
        href="#main"
        className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2 focus:ring-2"
      >
        {t('nav.skipToContent')}
      </a>

      <LandingHeader />

      <main id="main" className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AppPreviewSection />
        <HowItWorksSection />
        <MobileAppSection />
        <PricingSection />
        <FinalCtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
