import { type Locale } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { getTranslations } from '@/i18n/server';
import { LEGAL_VERSION, ROUTES } from '@/src/shared/lib';
import { type LegalDocumentName } from './LegalView.types';
import { formatLegalDate, readLegalDocument } from './LegalView.utils';
import { LegalText } from './ui/LegalText';

type LegalViewProps = {
  locale: Locale;
  document: LegalDocumentName;
};

const OTHER_DOCUMENT = {
  PrivacyPolicy: { labelKey: 'terms', href: ROUTES.terms },
  TermsOfService: { labelKey: 'privacy', href: ROUTES.privacy },
} as const;

/** A legal text (Privacy Policy or Terms of Service) written in the messages, as a readable page with a table of contents. */
export async function LegalView({ locale, document }: LegalViewProps) {
  const t = await getTranslations({ locale, namespace: document });
  const legal = await getTranslations({ locale, namespace: 'Legal' });
  const { title, intro, sections } = readLegalDocument(t('title'), t.raw('intro'), t.raw('sections'));
  const other = OTHER_DOCUMENT[document];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        <p className="text-muted-foreground text-sm">
          {legal('effectiveFrom', { date: formatLegalDate(LEGAL_VERSION, locale) })}
        </p>
        {intro.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            <LegalText text={paragraph} />
          </p>
        ))}
      </header>

      <nav aria-label={legal('tocLabel')} className="bg-muted/40 mb-10 rounded-xl border p-5">
        <p className="mb-3 text-sm font-medium">{legal('tocLabel')}</p>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-primary underline-offset-4 hover:underline">
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex flex-col gap-9">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-20">
            <h2 id={`${section.id}-title`} className="mb-3 text-xl font-semibold tracking-tight">
              {index + 1}. {section.title}
            </h2>
            <div className="flex flex-col gap-3 leading-relaxed">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <LegalText text={paragraph} />
                </p>
              ))}
              {section.items.length > 0 && (
                <ul className="flex list-disc flex-col gap-2 pl-5">
                  {section.items.map((item) => (
                    <li key={item}>
                      <LegalText text={item} />
                    </li>
                  ))}
                </ul>
              )}
              {section.closing && (
                <p>
                  <LegalText text={section.closing} />
                </p>
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t pt-6 text-sm">
        <span className="text-muted-foreground">{legal('otherDocument')}: </span>
        <Link href={other.href} className="text-primary underline underline-offset-4">
          {legal(other.labelKey)}
        </Link>
      </p>
    </article>
  );
}
