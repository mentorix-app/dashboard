import { GOOGLE_GSI_SCRIPT_URL } from './GoogleSignIn.constants';

let loading: Promise<void> | null = null;

/** Loads Google Identity Services once; resolves when `window.google.accounts.id` is usable. */
export const loadGoogleScript = (): Promise<void> => {
  if (window.google?.accounts.id) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_GSI_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Allow a retry on the next attempt (for example after the network comes back).
      loading = null;
      script.remove();
      reject(new Error('Google Identity Services failed to load'));
    };
    document.head.appendChild(script);
  });

  return loading;
};

export const clampButtonWidth = (available: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.floor(available)));
