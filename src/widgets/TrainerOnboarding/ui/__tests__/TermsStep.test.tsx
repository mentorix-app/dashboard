import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';

import { TermsStep } from '../TermsStep';

jest.mock('../../../../../i18n', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('../../../../../i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement('a', { href, ...rest }, children),
}));

const setup = (overrides: Partial<Parameters<typeof TermsStep>[0]> = {}) => {
  const props = {
    accepted: false,
    errorKey: null,
    isActivating: false,
    isSigningOut: false,
    onAcceptedChange: jest.fn(),
    onAccept: jest.fn(),
    onSignOut: jest.fn(),
    ...overrides,
  };
  render(<TermsStep {...props} />);
  return props;
};

describe('TermsStep', () => {
  it('links to the full Terms and the Privacy Policy, each in a new tab so the form is kept', () => {
    setup();

    const terms = screen.getByRole('link', { name: 'terms.readTerms' });
    const privacy = screen.getByRole('link', { name: 'terms.readPrivacy' });

    expect(terms).toHaveAttribute('href', '/terms');
    expect(terms).toHaveAttribute('target', '_blank');
    expect(privacy).toHaveAttribute('href', '/privacy');
    expect(privacy).toHaveAttribute('target', '_blank');
  });

  it('keeps the submit button off until the terms are accepted', () => {
    setup();

    expect(screen.getByRole('button', { name: 'terms.submit' })).toBeDisabled();
  });

  it('reports the checkbox and the accept click', async () => {
    const props = setup({ accepted: true });
    const user = userEvent.setup();

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'terms.submit' }));

    expect(props.onAcceptedChange).toHaveBeenCalledWith(false);
    expect(props.onAccept).toHaveBeenCalledTimes(1);
  });
});
