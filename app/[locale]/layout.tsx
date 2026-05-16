import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '@/app/providers';
import { type LayoutProps, getLayoutConfig } from './layout.conf';
export { generateStaticParams, generateMetadata } from './layout.utils';

const LocaleLayout = async (props: LayoutProps) => {
  const { messages, children } = await getLayoutConfig(props);

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
