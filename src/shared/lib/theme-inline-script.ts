/**
 * Minified IIFE injected in <head> before paint to avoid theme FOUC.
 * Keep in sync with ThemeSwitcher client handlers (localStorage.theme + html.dark).
 */
export const THEME_STORAGE_KEY = 'theme';

export const themeInlineScript = `(function(){document.documentElement.classList.toggle("dark",localStorage.theme==="dark"||(!("theme" in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches));})();`;
