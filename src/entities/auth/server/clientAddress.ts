import 'server-only';

import { headers } from 'next/headers';

import { pickClientAddress } from './clientAddress.utils';

/**
 * Browser address of the request being handled, forwarded to the API so its
 * auth rate limits count per person instead of per dashboard server. Returns
 * `null` outside a request or when the address is unknown.
 */
export const getClientAddress = async (): Promise<string | null> => {
  try {
    const incoming = await headers();
    return pickClientAddress((name) => incoming.get(name));
  } catch {
    return null;
  }
};
