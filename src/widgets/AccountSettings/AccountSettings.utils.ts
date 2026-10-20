/** A full page load to `url`; kept apart so tests can observe it (jsdom cannot navigate). */
export const navigateTo = (url: string): void => {
  window.location.assign(url);
};
