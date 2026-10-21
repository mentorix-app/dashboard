import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';

import { SUPPORT_MAILTO } from '@/src/shared/lib';
import { AuthFooter } from '../AuthFooter';

jest.mock('../../../../i18n', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('../../../../i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement('a', { href, ...rest }, children),
}));
jest.mock('../../../features/LanguageSwitcher/LanguageSwitcher', () => ({ LanguageSwitcher: () => null }));
jest.mock('../../../features/ThemeSwitcher/ThemeSwitcher', () => ({ ThemeSwitcher: () => null }));

describe('AuthFooter', () => {
  it('links to the Privacy Policy and the Terms of Service on the locale-aware routes', () => {
    render(<AuthFooter />);

    expect(screen.getByRole('link', { name: 'privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'terms' })).toHaveAttribute('href', '/terms');
  });

  it('offers a mail link to support instead of the old Help Center page', () => {
    render(<AuthFooter />);

    expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute('href', SUPPORT_MAILTO);
    expect(document.querySelector('a[href="/help"]')).toBeNull();
  });

  it('shows the copyright with the year', () => {
    render(<AuthFooter />);

    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Mentorix`))).toBeInTheDocument();
  });
});
