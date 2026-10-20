import { act, renderHook } from '@testing-library/react';

import { UserRole, useUserStore, type User } from '@/src/entities/user';
import { useConfirmStore } from '@/src/shared/ui/ConfirmationModal/confirmStore';
import { deleteAccountAction } from '@/src/entities/auth';
import { useAccountSettingsConfig } from '../AccountSettings.conf';
import { navigateTo } from '../AccountSettings.utils';

jest.mock('../../../../i18n', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('../../../entities/auth', () => ({
  deleteAccountAction: jest.fn(),
  APPLE_ACCOUNT_DELETION_START_PATH: '/api/auth/apple/start?intent=delete',
}));
jest.mock('../AccountSettings.utils', () => ({ navigateTo: jest.fn() }));

const mockedDelete = deleteAccountAction as jest.Mock;
const mockedNavigate = navigateTo as jest.Mock;

const client: User = { userId: 'u1', email: 'a@b.com', createdAt: '2026-10-01T00:00:00Z', roles: [UserRole.Client] };

const setUser = (user: User | null) => act(() => useUserStore.setState({ user }));

/** Presses the confirm button of the queued dialog. */
const confirmDeletion = async () => {
  const request = useConfirmStore.getState().request;
  if (!request) throw new Error('no confirmation was queued');
  await act(async () => request.onConfirm());
};

beforeEach(() => {
  jest.clearAllMocks();
  setUser(client);
  act(() => useConfirmStore.setState({ request: null, isPending: false }));
});

describe('useAccountSettingsConfig', () => {
  it('is not ready until the profile is loaded', () => {
    setUser(null);

    const { result } = renderHook(() => useAccountSettingsConfig({}));

    expect(result.current.isReady).toBe(false);
  });

  it('tells apart clients, trainers and administrators', () => {
    const { result, rerender } = renderHook(() => useAccountSettingsConfig({}));
    expect(result.current).toMatchObject({ isReady: true, isAdmin: false, isTrainer: false });

    setUser({ ...client, roles: [UserRole.Client, UserRole.Trainer] });
    rerender();
    expect(result.current).toMatchObject({ isAdmin: false, isTrainer: true });

    setUser({ ...client, roles: [UserRole.Admin] });
    rerender();
    expect(result.current).toMatchObject({ isAdmin: true, isTrainer: false });
  });

  it('asks for confirmation before deleting anything', () => {
    const { result } = renderHook(() => useAccountSettingsConfig({}));

    act(() => result.current.requestDeletion());

    expect(useConfirmStore.getState().request).toMatchObject({
      title: 'confirm.title',
      description: 'confirm.description',
      cancelLabel: 'confirm.cancel',
      confirmLabel: 'confirm.submit',
    });
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it('leaves for the login page with a full page load once the account is deleted', async () => {
    mockedDelete.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAccountSettingsConfig({}));
    act(() => result.current.requestDeletion());

    await confirmDeletion();

    expect(mockedNavigate).toHaveBeenCalledWith('/login?deleted=1');
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('sends the person through Apple when the API asks for a fresh Apple authorization', async () => {
    mockedDelete.mockResolvedValue({ errorCode: 'apple_required' });
    const { result } = renderHook(() => useAccountSettingsConfig({}));
    act(() => result.current.requestDeletion());

    await confirmDeletion();

    expect(mockedNavigate).toHaveBeenCalledWith('/api/auth/apple/start?intent=delete');
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('shows why the account was not deleted and stays on the page', async () => {
    mockedDelete.mockResolvedValue({ errorCode: 'has_data' });
    const { result } = renderHook(() => useAccountSettingsConfig({}));
    act(() => result.current.requestDeletion());

    await confirmDeletion();

    expect(result.current.errorMessage).toBe('errors.has_data');
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it('reports the service as unavailable when the action itself fails', async () => {
    mockedDelete.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useAccountSettingsConfig({}));
    act(() => result.current.requestDeletion());

    await confirmDeletion();

    expect(result.current.errorMessage).toBe('errors.unavailable');
  });

  it('shows the reason Apple sent the browser back with, and clears it on the next attempt', async () => {
    mockedDelete.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAccountSettingsConfig({ initialError: 'apple_cancelled' }));
    expect(result.current.errorMessage).toBe('errors.apple_cancelled');

    act(() => result.current.requestDeletion());
    await confirmDeletion();

    expect(result.current.errorMessage).toBeUndefined();
  });
});
