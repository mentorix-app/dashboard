/**
 * Copies text to the clipboard, resolving to whether the write succeeded.
 * Requires a secure context (HTTPS or localhost) where the async Clipboard
 * API is available.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
