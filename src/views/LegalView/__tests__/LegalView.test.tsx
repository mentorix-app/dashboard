import { render, screen, within } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';

import { LEGAL_VERSION, SUPPORT_MAILTO } from '@/src/shared/lib';
import { LegalView } from '../LegalView';
import { formatLegalDate } from '../LegalView.utils';

jest.mock('../../../../i18n/server', () => ({
  getTranslations: (options: { locale?: string; namespace: string }) =>
    jest.requireActual('../../__tests__/translator.mock').getTranslationsMock(options),
}));
jest.mock('../../../../i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement('a', { href, ...rest }, children),
}));

const renderView = async (document: 'PrivacyPolicy' | 'TermsOfService') =>
  render(await LegalView({ locale: 'en', document }));

describe('LegalView', () => {
  it('shows the title, the date the version took effect and the intro', async () => {
    await renderView('PrivacyPolicy');

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByText(`Effective from ${formatLegalDate(LEGAL_VERSION, 'en')}`)).toBeInTheDocument();
    expect(screen.getByText(/explains what personal data Mentorix collects/)).toBeInTheDocument();
  });

  it('lists every section in the contents, each linking to its own heading', async () => {
    await renderView('PrivacyPolicy');

    const toc = screen.getByRole('navigation', { name: 'Contents' });
    const links = within(toc).getAllByRole('link');
    const headings = screen.getAllByRole('heading', { level: 2 });

    expect(links).toHaveLength(headings.length);
    expect(links[0]).toHaveAttribute('href', '#who-we-are');
    expect(document.getElementById('who-we-are')).toHaveAttribute('aria-labelledby', 'who-we-are-title');
    expect(headings[0]).toHaveTextContent('1. Who we are');
  });

  it('turns the contact address into a mail link', async () => {
    await renderView('PrivacyPolicy');

    const mailLinks = screen.getAllByRole('link', { name: 'mentorix.app@proton.me' });
    expect(mailLinks.length).toBeGreaterThan(0);
    for (const link of mailLinks) expect(link).toHaveAttribute('href', SUPPORT_MAILTO);
  });

  it('renders the Google section with its Limited Use statement', async () => {
    await renderView('PrivacyPolicy');

    expect(screen.getByRole('heading', { level: 2, name: /How we use data from Google/ })).toBeInTheDocument();
    expect(screen.getByText(/Limited Use requirements/)).toBeInTheDocument();
  });

  it('renders lists and the paragraph that follows a list', async () => {
    await renderView('PrivacyPolicy');

    expect(screen.getByText(/one session cookie \(auth_session\)/)).toBeInTheDocument();
    expect(screen.getByText(/loads a script from accounts\.google\.com/)).toBeInTheDocument();
  });

  it('points from the Privacy Policy to the Terms and back', async () => {
    const { unmount } = await renderView('PrivacyPolicy');
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
    unmount();

    await renderView('TermsOfService');
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
  });

  it('says that fitness information is not medical advice', async () => {
    await renderView('TermsOfService');

    expect(screen.getByRole('heading', { level: 2, name: /not medical advice/ })).toBeInTheDocument();
  });
});
