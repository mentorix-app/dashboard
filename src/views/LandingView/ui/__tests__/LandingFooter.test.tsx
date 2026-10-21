import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';

import { SUPPORT_MAILTO } from '@/src/shared/lib';
import { LandingFooter } from '../LandingFooter';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt?: string }) => createElement('img', { alt }),
}));
jest.mock('../../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('../../../../../i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement('a', { href, ...rest }, children),
}));

describe('LandingFooter', () => {
  it('links the Privacy Policy and the Terms of Service from the homepage (Google asks for it)', () => {
    render(<LandingFooter />);

    expect(screen.getByRole('link', { name: 'footer.links.privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'footer.links.terms' })).toHaveAttribute('href', '/terms');
  });

  it('keeps the section anchors and the sign-in link, and adds the support mail link', () => {
    render(<LandingFooter />);

    expect(screen.getByRole('link', { name: 'footer.links.features' })).toHaveAttribute('href', '#features');
    expect(screen.getByRole('link', { name: 'footer.links.signIn' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'footer.links.contact' })).toHaveAttribute('href', SUPPORT_MAILTO);
  });
});
