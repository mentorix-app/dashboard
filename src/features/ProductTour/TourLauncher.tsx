'use client';

import { useTourLauncher } from './ProductTour.conf';

/** Renders nothing; lives inside the cabinet so the tour finds the elements it points at. */
export const TourLauncher = () => {
  useTourLauncher();
  return null;
};
