import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_ONBOARDING_FLAGS, ONBOARDING_STORAGE_KEY } from './onboarding.constants';
import type { OnboardingFlags } from './types';

type OnboardingState = {
  /** Dismissed steps per user id. The backend has no field for this, so it lives in `localStorage`. */
  flagsByUser: Record<string, OnboardingFlags>;
  /** Set when the person asks for the product tour; the launcher in the cabinet consumes it. */
  tourRequested: boolean;
  /**
   * `true` while the first-run flow is on screen. A refetch of `/auth/me` after the
   * person became a trainer must not take the last step away from them.
   */
  onboardingActive: boolean;
  markTourSeen: (userId: string) => void;
  requestTour: () => void;
  clearTourRequest: () => void;
  beginOnboarding: () => void;
  endOnboarding: () => void;
};

const patchFlags = (
  flagsByUser: Record<string, OnboardingFlags>,
  userId: string,
  patch: Partial<OnboardingFlags>
): Record<string, OnboardingFlags> => ({
  ...flagsByUser,
  [userId]: { ...(flagsByUser[userId] ?? DEFAULT_ONBOARDING_FLAGS), ...patch },
});

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      flagsByUser: {},
      tourRequested: false,
      onboardingActive: false,
      markTourSeen: (userId) =>
        set((state) => ({ flagsByUser: patchFlags(state.flagsByUser, userId, { tourSeen: true }) })),
      requestTour: () => set({ tourRequested: true }),
      clearTourRequest: () => set({ tourRequested: false }),
      beginOnboarding: () => set({ onboardingActive: true }),
      endOnboarding: () => set({ onboardingActive: false }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ flagsByUser: state.flagsByUser }),
    }
  )
);
