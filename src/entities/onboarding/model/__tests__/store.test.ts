import { act } from '@testing-library/react';

import { useOnboardingStore } from '../store';

const reset = () =>
  act(() => {
    useOnboardingStore.setState({ flagsByUser: {}, tourRequested: false });
  });

describe('useOnboardingStore', () => {
  beforeEach(reset);
  afterAll(() => {
    reset();
    localStorage.clear();
  });

  it('starts with nothing dismissed and no tour requested', () => {
    expect(useOnboardingStore.getState().flagsByUser).toEqual({});
    expect(useOnboardingStore.getState().tourRequested).toBe(false);
  });

  it('keeps the flags of every user apart', () => {
    act(() => {
      useOnboardingStore.getState().markTourSeen('u1');
    });

    expect(useOnboardingStore.getState().flagsByUser).toEqual({ u1: { tourSeen: true } });
  });

  it('requests and clears the tour', () => {
    act(() => useOnboardingStore.getState().requestTour());
    expect(useOnboardingStore.getState().tourRequested).toBe(true);

    act(() => useOnboardingStore.getState().clearTourRequest());
    expect(useOnboardingStore.getState().tourRequested).toBe(false);
  });

  it('persists the flags but not the one-off tour request', () => {
    act(() => {
      useOnboardingStore.getState().markTourSeen('u1');
      useOnboardingStore.getState().requestTour();
    });

    const stored = JSON.parse(localStorage.getItem('mentorix-onboarding') ?? '{}') as {
      state: Record<string, unknown>;
    };
    expect(stored.state).toEqual({ flagsByUser: { u1: { tourSeen: true } } });
  });
});
