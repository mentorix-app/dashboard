'use client';

import 'driver.js/dist/driver.css';

import { useCallback, useEffect } from 'react';

import { useTranslations } from '@/i18n';
import { useOnboardingStore } from '@/src/entities/onboarding';
import { useUserStore } from '@/src/entities/user';
import { TOUR_POPOVER_CLASS, TOUR_PROGRESS_TEXT, TOUR_STEPS, TOUR_WAIT_FOR_ELEMENT_MS } from './ProductTour.constants';
import { findTourElement } from './ProductTour.utils';

/** Returns a function that runs the product tour; driver.js is loaded the first time it is called. */
export const useProductTour = () => {
  const t = useTranslations('ProductTour');

  return useCallback(async () => {
    const { driver } = await import('driver.js');

    const tour = driver({
      steps: TOUR_STEPS.map(({ key, targets }) => ({
        // Looked up when the stop is reached; driver.js treats `undefined` as a missing element.
        element: (() => findTourElement(targets)) as () => Element,
        popover: { title: t(`steps.${key}.title`), description: t(`steps.${key}.description`) },
      })),
      showProgress: true,
      progressText: TOUR_PROGRESS_TEXT,
      nextBtnText: t('next'),
      prevBtnText: t('previous'),
      doneBtnText: t('done'),
      closeBtnLabel: t('close'),
      popoverClass: TOUR_POPOVER_CLASS,
      skipMissingElement: true,
      waitForElement: TOUR_WAIT_FOR_ELEMENT_MS,
      overlayOpacity: 0.55,
      // Finishing and closing both count as seen. Read at that moment: the user may not
      // have been in the store yet when the tour started.
      onDestroyed: () => {
        const user = useUserStore.getState().user;
        if (user) useOnboardingStore.getState().markTourSeen(user.userId);
      },
    });

    tour.drive();
  }, [t]);
};

/** Starts the tour once when somebody asked for it (the onboarding or the checklist). */
export const useTourLauncher = () => {
  const startTour = useProductTour();
  const tourRequested = useOnboardingStore((state) => state.tourRequested);
  const clearTourRequest = useOnboardingStore((state) => state.clearTourRequest);

  useEffect(() => {
    if (!tourRequested) return;
    clearTourRequest();
    void startTour();
  }, [tourRequested, clearTourRequest, startTour]);
};
