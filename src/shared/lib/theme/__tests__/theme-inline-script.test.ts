import { THEME_STORAGE_KEY, themeInlineScript } from '@/src/shared/lib/theme';

describe('themeInlineScript', () => {
  it('uses the namespaced localStorage key', () => {
    expect(THEME_STORAGE_KEY).toBe('mentorix.theme');
    expect(themeInlineScript).toContain(JSON.stringify(THEME_STORAGE_KEY));
  });

  it('toggles the dark class from stored preference and system preference', () => {
    expect(themeInlineScript).toContain('classList.toggle');
    expect(themeInlineScript).toContain('"dark"');
    expect(themeInlineScript).toContain('prefers-color-scheme: dark');
    expect(themeInlineScript).toContain('localStorage.getItem');
  });
});
