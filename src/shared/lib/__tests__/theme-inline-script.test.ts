import { THEME_STORAGE_KEY, themeInlineScript } from '@/src/shared/lib/theme-inline-script';

describe('themeInlineScript', () => {
  it('uses the expected localStorage key', () => {
    expect(THEME_STORAGE_KEY).toBe('theme');
    expect(themeInlineScript).toContain('localStorage.theme');
  });

  it('toggles the dark class from stored preference and system preference', () => {
    expect(themeInlineScript).toContain('classList.toggle');
    expect(themeInlineScript).toContain('"dark"');
    expect(themeInlineScript).toContain('prefers-color-scheme: dark');
    expect(themeInlineScript).toContain('"theme" in localStorage');
  });
});
