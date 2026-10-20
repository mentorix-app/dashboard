import { act, renderHook, waitFor } from '@testing-library/react';

import { useOnboardingStore } from '@/src/entities/onboarding';
import { UserRole, useUserStore } from '@/src/entities/user';
import { useProductTour, useTourLauncher } from '../ProductTour.conf';

const mockDrive = jest.fn();
const mockDriver = jest.fn((config: unknown) => ({ drive: mockDrive, config }));

jest.mock('driver.js', () => ({ driver: (config: unknown) => mockDriver(config) }));
jest.mock('../../../../i18n', () => ({ useTranslations: () => (key: string) => key }));

type TourConfig = {
  steps: { element: () => Element | undefined; popover: { title: string; description: string } }[];
  skipMissingElement: boolean;
  waitForElement: number;
  popoverClass: string;
  onDestroyed: () => void;
};

const lastConfig = (): TourConfig => {
  const config = mockDriver.mock.calls.at(-1)?.[0];
  if (!config) throw new Error('driver was not created');
  return config as TourConfig;
};

// jsdom has no layout, so every element would count as hidden; `data-hidden` marks the ones that should.
beforeAll(() => {
  jest.spyOn(Element.prototype, 'getClientRects').mockImplementation(function (this: Element) {
    return (this.hasAttribute('data-hidden') ? [] : [{}]) as unknown as DOMRectList;
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  act(() => {
    useUserStore.setState({ user: null });
    useOnboardingStore.setState({ flagsByUser: {}, tourRequested: false });
  });
});

describe('useProductTour', () => {
  it('runs a tour over the four sections, waiting for stops that are not on the page yet', async () => {
    const { result } = renderHook(() => useProductTour());

    await act(async () => result.current());

    expect(mockDrive).toHaveBeenCalledTimes(1);
    const config = lastConfig();
    expect(config.steps.map((step) => step.popover.title)).toEqual([
      'steps.exercises.title',
      'steps.programs.title',
      'steps.clients.title',
      'steps.analytics.title',
    ]);
    expect(config.steps[0]?.popover).toEqual({
      title: 'steps.exercises.title',
      description: 'steps.exercises.description',
    });
    expect(config.skipMissingElement).toBe(true);
    expect(config.waitForElement).toBeGreaterThan(0);
    expect(config.popoverClass).toBe('mentorix-tour');
  });

  it('points a stop at the sidebar item when there is one', async () => {
    document.body.innerHTML = '<a id="nav" data-tour="nav-programs"></a><a id="card" data-tour="card-programs"></a>';
    const { result } = renderHook(() => useProductTour());
    await act(async () => result.current());

    expect(lastConfig().steps[1]?.element()?.id).toBe('nav');
  });

  it('points a stop at the dashboard card where the sidebar is hidden (a phone)', async () => {
    document.body.innerHTML =
      '<a id="nav" data-hidden data-tour="nav-programs"></a><a id="card" data-tour="card-programs"></a>';
    const { result } = renderHook(() => useProductTour());
    await act(async () => result.current());

    expect(lastConfig().steps[1]?.element()?.id).toBe('card');
  });

  it('leaves a stop without anything to point at to driver.js, which skips it', async () => {
    const { result } = renderHook(() => useProductTour());
    await act(async () => result.current());

    expect(lastConfig().steps[0]?.element()).toBeUndefined();
  });

  it('marks the tour as seen for the current user when it ends, however it ends', async () => {
    act(() =>
      useUserStore.setState({
        user: { userId: 'u1', email: 'a@b.com', createdAt: '', roles: [UserRole.Trainer] },
      })
    );
    const { result } = renderHook(() => useProductTour());
    await act(async () => result.current());

    act(() => lastConfig().onDestroyed());

    expect(useOnboardingStore.getState().flagsByUser.u1?.tourSeen).toBe(true);
  });

  it('does not record anything when nobody is signed in', async () => {
    const { result } = renderHook(() => useProductTour());
    await act(async () => result.current());

    act(() => lastConfig().onDestroyed());

    expect(useOnboardingStore.getState().flagsByUser).toEqual({});
  });
});

describe('useTourLauncher', () => {
  it('does nothing until the tour is requested', () => {
    renderHook(() => useTourLauncher());

    expect(mockDriver).not.toHaveBeenCalled();
  });

  it('starts the tour once and consumes the request', async () => {
    renderHook(() => useTourLauncher());

    act(() => useOnboardingStore.getState().requestTour());

    await waitFor(() => expect(mockDrive).toHaveBeenCalledTimes(1));
    expect(useOnboardingStore.getState().tourRequested).toBe(false);
  });

  it('starts right away when the request was made before the launcher mounted', async () => {
    act(() => useOnboardingStore.getState().requestTour());

    renderHook(() => useTourLauncher());

    await waitFor(() => expect(mockDrive).toHaveBeenCalledTimes(1));
  });
});
