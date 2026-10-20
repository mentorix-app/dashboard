import type { TOUR_STEPS } from './ProductTour.constants';

export type TourTarget = (typeof TOUR_STEPS)[number]['targets'][number];
