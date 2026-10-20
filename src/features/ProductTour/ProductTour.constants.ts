/** Attribute that marks the elements the tour points at. */
export const TOUR_ATTRIBUTE = 'data-tour';

export const TOUR_POPOVER_CLASS = 'mentorix-tour';

/** driver.js fills in the placeholders itself. */
export const TOUR_PROGRESS_TEXT = '{{current}} / {{total}}';

/**
 * How long a stop waits for its element (ms). The tour may start while the page is still
 * mounting, for example right after the cabinet opens or after a jump to the dashboard.
 */
export const TOUR_WAIT_FOR_ELEMENT_MS = 3000;

/**
 * The stops of the tour, in order. A stop points at the first of its targets that is shown:
 * the sidebar item, or the card of the same section on the dashboard where there is no sidebar
 * (on a phone it hides in a drawer). A stop with nothing to point at is skipped.
 */
export const TOUR_STEPS = [
  { key: 'exercises', targets: ['nav-exercises', 'card-exercises'] },
  { key: 'programs', targets: ['nav-programs', 'card-programs'] },
  { key: 'clients', targets: ['nav-clients', 'card-clients'] },
  { key: 'analytics', targets: ['nav-analytics', 'card-analytics'] },
] as const;
