/**
 * Minified IIFE injected in <head> before paint to avoid theme FOUC.
 * Keep in sync with ThemeSwitcher client handlers (localStorage[THEME_STORAGE_KEY] + html.dark).
 */
export const THEME_STORAGE_KEY = 'mentorix.theme';

export const themeInlineScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var v=localStorage.getItem(k);var d=v==="dark"||(v===null&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
