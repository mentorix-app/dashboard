import { TOUR_ATTRIBUTE } from './ProductTour.constants';
import type { TourTarget } from './ProductTour.types';

/** Spread onto an element to make it a stop of the tour: `<a {...tourTarget('nav-clients')} />`. */
export const tourTarget = (target: TourTarget): Record<typeof TOUR_ATTRIBUTE, TourTarget> => ({
  [TOUR_ATTRIBUTE]: target,
});

/** CSS selector that finds the element carrying the given target. */
export const tourSelector = (target: TourTarget): string => `[${TOUR_ATTRIBUTE}="${target}"]`;

/** `false` for an element that takes no room on the page, such as one inside a hidden sidebar. */
const isShown = (element: Element): boolean => element.getClientRects().length > 0;

/** The first of the targets that is on the page and shown; `undefined` when there is none. */
export const findTourElement = (targets: readonly TourTarget[]): Element | undefined => {
  for (const target of targets) {
    const element = document.querySelector(tourSelector(target));
    if (element && isShown(element)) return element;
  }
  return undefined;
};
