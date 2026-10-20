import { clampButtonWidth } from '../GoogleSignIn.utils';

/** The loader keeps the pending script in module state, so every test starts from a fresh copy. */
const freshLoader = async () => {
  jest.resetModules();
  const { loadGoogleScript } = await import('../GoogleSignIn.utils');
  return loadGoogleScript;
};

describe('clampButtonWidth', () => {
  it('uses the available width within the limits', () => {
    expect(clampButtonWidth(320.7, 200, 400)).toBe(320);
  });

  it('never goes below the minimum or above the maximum', () => {
    expect(clampButtonWidth(0, 200, 400)).toBe(200);
    expect(clampButtonWidth(900, 200, 400)).toBe(400);
  });
});

describe('loadGoogleScript', () => {
  afterEach(() => {
    delete window.google;
    document.head.innerHTML = '';
  });

  it('resolves at once when Google Identity Services is already there', async () => {
    window.google = { accounts: { id: { initialize: jest.fn(), renderButton: jest.fn() } } };
    const loadGoogleScript = await freshLoader();

    await expect(loadGoogleScript()).resolves.toBeUndefined();
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('adds the script once and resolves when it loads', async () => {
    const loadGoogleScript = await freshLoader();

    const first = loadGoogleScript();
    const second = loadGoogleScript();

    const scripts = document.head.querySelectorAll('script');
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.src).toBe('https://accounts.google.com/gsi/client');

    scripts[0]?.dispatchEvent(new Event('load'));

    await expect(Promise.all([first, second])).resolves.toEqual([undefined, undefined]);
  });

  it('rejects when the script fails to load and allows a later retry', async () => {
    const loadGoogleScript = await freshLoader();

    const failed = loadGoogleScript();
    document.head.querySelector('script')?.dispatchEvent(new Event('error'));
    await expect(failed).rejects.toThrow('failed to load');

    const retry = loadGoogleScript();
    expect(document.head.querySelectorAll('script')).toHaveLength(1);
    document.head.querySelector('script')?.dispatchEvent(new Event('load'));
    await expect(retry).resolves.toBeUndefined();
  });
});
