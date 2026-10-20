import { act } from '@testing-library/react';

import { useOnboardingStore } from '@/src/entities/onboarding';
import { useActivateTrainer, UserRole, type User } from '@/src/entities/user';
import { queryKeys } from '@/src/shared/api';
import { createTestQueryClient, renderHookWithClient } from '@/src/shared/api/__tests__/queryClientTestUtils';
import { logoutAction } from '@/src/entities/auth';
import { useTrainerOnboardingConfig } from '../TrainerOnboarding.conf';
import { TRAINER_TERMS_VERSION } from '../TrainerOnboarding.constants';

jest.mock('../../../entities/auth', () => ({ logoutAction: jest.fn() }));
jest.mock('../../../entities/user', () => ({
  ...jest.requireActual('../../../entities/user/model/types'),
  useActivateTrainer: jest.fn(),
}));

const mockedActivate = useActivateTrainer as jest.Mock;
const mockedLogout = logoutAction as jest.Mock;

const clientUser: User = {
  userId: 'u1',
  email: 'a@b.com',
  createdAt: '2026-10-01T00:00:00Z',
  roles: [UserRole.Client],
};
const trainerUser: User = { ...clientUser, roles: [UserRole.Client, UserRole.Trainer] };

const meKey = [...queryKeys.user.me(), '/auth/me', undefined];

const mutate = jest.fn();

/** Calls `mutate`'s onSuccess the way TanStack Query does after the request succeeds. */
const succeedActivation = (user: User) => {
  const [, options] = mutate.mock.calls[0] as [unknown, { onSuccess: (user: User) => void }];
  act(() => options.onSuccess(user));
};

const setup = () => {
  const client = createTestQueryClient();
  client.setQueryData(meKey, clientUser);
  const hook = renderHookWithClient(() => useTrainerOnboardingConfig(), { client });
  return { client, ...hook };
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedActivate.mockReturnValue({ mutate, isPending: false, error: null });
  act(() => useOnboardingStore.setState({ onboardingActive: false, tourRequested: false }));
});

describe('useTrainerOnboardingConfig', () => {
  it('starts on the welcome step and marks the onboarding as active for the gate', () => {
    const { result } = setup();

    expect(result.current.step).toBe('welcome');
    expect(result.current.stepIndex).toBe(0);
    expect(result.current.stepCount).toBe(3);
    expect(useOnboardingStore.getState().onboardingActive).toBe(true);
  });

  it('is no longer active once it unmounts', () => {
    const { unmount } = setup();

    unmount();

    expect(useOnboardingStore.getState().onboardingActive).toBe(false);
  });

  it('moves to the terms step and never past the last one', () => {
    const { result } = setup();

    act(() => result.current.onContinue());
    expect(result.current.step).toBe('terms');

    act(() => result.current.onContinue());
    act(() => result.current.onContinue());
    expect(result.current.step).toBe('howItWorks');
  });

  it('tracks whether the terms are accepted', () => {
    const { result } = setup();

    act(() => result.current.onAcceptedChange(true));

    expect(result.current.accepted).toBe(true);
  });

  it('sends the terms version when the terms are accepted', () => {
    const { result } = setup();

    act(() => result.current.onAccept());

    expect(mutate).toHaveBeenCalledWith({ termsVersion: TRAINER_TERMS_VERSION }, expect.any(Object));
  });

  it('advances after the activation but keeps the cabinet away until the person finishes', () => {
    const { result, client } = setup();
    act(() => result.current.onContinue());
    act(() => result.current.onAccept());

    succeedActivation(trainerUser);

    expect(result.current.step).toBe('howItWorks');
    expect(client.getQueryData(meKey)).toEqual(clientUser);
  });

  it('puts the trainer profile into the cache and hands over to the cabinet on finish', () => {
    const { result, client } = setup();
    act(() => result.current.onAccept());
    succeedActivation(trainerUser);

    act(() => result.current.onFinish());

    expect(client.getQueryData(meKey)).toEqual(trainerUser);
    expect(useOnboardingStore.getState().onboardingActive).toBe(false);
  });

  it('starts the tour by itself when the person finishes', () => {
    const { result } = setup();
    act(() => result.current.onAccept());
    succeedActivation(trainerUser);

    act(() => result.current.onFinish());

    expect(useOnboardingStore.getState().tourRequested).toBe(true);
  });

  it('does nothing on finish before the activation succeeded', () => {
    const { result, client } = setup();

    act(() => result.current.onFinish());

    expect(client.getQueryData(meKey)).toEqual(clientUser);
    expect(useOnboardingStore.getState().tourRequested).toBe(false);
  });

  it('exposes the pending state and a message key for a failed activation', () => {
    mockedActivate.mockReturnValue({
      mutate,
      isPending: true,
      error: Object.assign(new Error('x'), { status: 503, cause: undefined }),
    });
    const { result } = setup();

    expect(result.current.isActivating).toBe(true);
    expect(result.current.errorKey).toBe('unavailable');
  });

  it('signs the person out', async () => {
    mockedLogout.mockResolvedValue(undefined);
    const { result } = setup();

    await act(async () => result.current.onSignOut());

    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });
});
