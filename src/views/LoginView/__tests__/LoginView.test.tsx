import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';

import { LoginView } from '../LoginView';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt?: string }) => createElement('img', { alt }),
}));
jest.mock('../../../../i18n', () => ({ useLocale: () => 'en', useTranslations: () => (key: string) => key }));
jest.mock('../../../../i18n/server', () => ({
  getTranslations: (options: string | { locale?: string; namespace: string }) =>
    jest.requireActual('../../__tests__/translator.mock').getTranslationsMock(options),
}));
jest.mock('../../../../i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement('a', { href, ...rest }, children),
}));
jest.mock('../../../features/GoogleSignIn', () => ({ GoogleSignIn: () => createElement('div', null, 'google') }));
jest.mock('../../../features/AppleSignIn', () => ({ AppleSignIn: () => createElement('div', null, 'apple') }));
jest.mock('../../../entities/auth', () => ({
  AuthErrorAlert: ({ failure }: { failure: { errorCode: string } }) =>
    createElement('p', { role: 'alert' }, failure.errorCode),
}));

const renderView = async (props: { accountDeleted?: boolean } = {}) =>
  render(await LoginView({ locale: 'en', ...props }));

describe('LoginView', () => {
  it('tells people that continuing means accepting the Terms and the Privacy Policy, with links to both', async () => {
    await renderView();

    expect(screen.getByText(/By continuing, you agree to the/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
  });

  it('shows the notice after the sign-in buttons', async () => {
    await renderView();

    const apple = screen.getByText('apple');
    const notice = screen.getByText(/By continuing, you agree to the/);
    expect(apple.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('tells a person whose account was deleted so', async () => {
    await renderView({ accountDeleted: true });

    expect(screen.getByRole('status')).toHaveTextContent('Your account has been deleted.');
  });
});
