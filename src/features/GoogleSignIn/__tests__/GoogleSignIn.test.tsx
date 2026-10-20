import { act, render, screen, waitFor } from '@testing-library/react';

import { googleSignInAction, prepareGoogleSignInAction } from '@/src/entities/auth';
import { GoogleSignIn } from '../GoogleSignIn';
import { loadGoogleScript } from '../GoogleSignIn.utils';

jest.mock('../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'ru',
}));
jest.mock('../../../entities/auth', () => {
  const { createElement } = jest.requireActual('react');
  return {
    prepareGoogleSignInAction: jest.fn(),
    googleSignInAction: jest.fn(),
    AuthErrorAlert: ({ failure }: { failure: { errorCode: string } }) =>
      createElement('p', { role: 'alert' }, failure.errorCode),
  };
});
jest.mock('../GoogleSignIn.utils', () => ({
  ...jest.requireActual('../GoogleSignIn.utils'),
  loadGoogleScript: jest.fn(),
}));

const mockedPrepare = prepareGoogleSignInAction as jest.Mock;
const mockedSignIn = googleSignInAction as jest.Mock;
const mockedLoad = loadGoogleScript as jest.Mock;

const initialize = jest.fn();
const renderButton = jest.fn();

type Configuration = { client_id: string; nonce: string; callback: (response: { credential: string }) => void };
const lastCallback = (): Configuration['callback'] => {
  const calls = initialize.mock.calls as [Configuration][];
  const last = calls.at(-1);
  if (!last) throw new Error('initialize was not called');
  return last[0].callback;
};

const originalClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'web-client.apps.googleusercontent.com';
  window.google = { accounts: { id: { initialize, renderButton } } };
  mockedLoad.mockResolvedValue(undefined);
  mockedPrepare.mockResolvedValue({ nonce: 'hashed-nonce' });
});

afterEach(() => {
  delete window.google;
});

afterAll(() => {
  if (originalClientId === undefined) delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  else process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalClientId;
});

describe('GoogleSignIn', () => {
  it('says so and does nothing when no Google client ID is configured', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    render(<GoogleSignIn />);

    expect(screen.getByText('google.unavailable')).toBeInTheDocument();
    expect(mockedPrepare).not.toHaveBeenCalled();
    expect(initialize).not.toHaveBeenCalled();
  });

  it('gives Google the client ID, the hashed nonce and the page language, then renders the button', async () => {
    render(<GoogleSignIn />);
    expect(screen.getByText('google.loading')).toBeInTheDocument();

    await waitFor(() => expect(renderButton).toHaveBeenCalledTimes(1));

    expect(initialize).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: 'web-client.apps.googleusercontent.com', nonce: 'hashed-nonce' })
    );
    expect(renderButton).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ locale: 'ru', text: 'continue_with', width: 200 })
    );
    expect(screen.queryByText('google.loading')).not.toBeInTheDocument();
  });

  it("does not redraw Google's button when the page theme changes", async () => {
    render(<GoogleSignIn />);
    await waitFor(() => expect(renderButton).toHaveBeenCalledTimes(1));

    await act(async () => {
      document.documentElement.classList.add('dark');
    });
    await act(async () => {
      document.documentElement.classList.remove('dark');
    });

    expect(renderButton).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(screen.getByText('google.continue')).toBeInTheDocument();
  });

  it('sends the credential to the sign-in action', async () => {
    mockedSignIn.mockResolvedValue(undefined);
    render(<GoogleSignIn />);
    await waitFor(() => expect(initialize).toHaveBeenCalled());

    await act(async () => lastCallback()({ credential: 'google-id-token' }));

    expect(mockedSignIn).toHaveBeenCalledWith('google-id-token');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the failure and sets the button up again with a fresh nonce', async () => {
    mockedSignIn.mockResolvedValue({ errorCode: 'invalid_token' });
    mockedPrepare.mockResolvedValueOnce({ nonce: 'first' }).mockResolvedValueOnce({ nonce: 'second' });
    render(<GoogleSignIn />);
    await waitFor(() => expect(initialize).toHaveBeenCalledTimes(1));

    await act(async () => lastCallback()({ credential: 'bad-token' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('invalid_token');
    await waitFor(() => expect(initialize).toHaveBeenCalledTimes(2));
    expect(mockedPrepare).toHaveBeenCalledTimes(2);
    expect(initialize).toHaveBeenLastCalledWith(expect.objectContaining({ nonce: 'second' }));
  });

  it('reports Google sign-in as unavailable when the script cannot be loaded', async () => {
    mockedLoad.mockRejectedValue(new Error('Google Identity Services failed to load'));

    render(<GoogleSignIn />);

    expect(await screen.findByText('google.unavailable')).toBeInTheDocument();
    expect(initialize).not.toHaveBeenCalled();
  });
});
