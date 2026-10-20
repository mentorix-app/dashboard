/**
 * @jest-environment node
 */
jest.mock('server-only', () => ({}));
jest.mock('next/headers', () => ({ headers: jest.fn() }));

import { headers } from 'next/headers';
import { getClientAddress } from '../clientAddress';
import { pickClientAddress } from '../clientAddress.utils';

const mockedHeaders = headers as jest.Mock;

describe('pickClientAddress', () => {
  const reader = (values: Record<string, string>) => (name: string) => values[name] ?? null;

  it('uses the Cloudflare header', () => {
    expect(pickClientAddress(reader({ 'cf-connecting-ip': '203.0.113.7' }))).toBe('203.0.113.7');
  });

  it('accepts an IPv6 address and trims it', () => {
    expect(pickClientAddress(reader({ 'cf-connecting-ip': ' 2001:db8::1 ' }))).toBe('2001:db8::1');
  });

  it('ignores a value that is not an IP address', () => {
    expect(pickClientAddress(reader({ 'cf-connecting-ip': 'not-an-ip' }))).toBeNull();
  });

  it('does not trust X-Forwarded-For, whose left part the client chooses', () => {
    expect(pickClientAddress(reader({ 'x-forwarded-for': '198.51.100.9' }))).toBeNull();
  });

  it('returns null when the header is missing or blank', () => {
    expect(pickClientAddress(reader({}))).toBeNull();
    expect(pickClientAddress(reader({ 'cf-connecting-ip': '  ' }))).toBeNull();
  });
});

describe('getClientAddress', () => {
  beforeEach(() => jest.resetAllMocks());

  it('reads the address from the incoming request headers', async () => {
    mockedHeaders.mockResolvedValue(new Headers({ 'cf-connecting-ip': '203.0.113.7' }));

    await expect(getClientAddress()).resolves.toBe('203.0.113.7');
  });

  it('returns null outside a request instead of throwing', async () => {
    mockedHeaders.mockRejectedValue(new Error('headers was called outside a request scope'));

    await expect(getClientAddress()).resolves.toBeNull();
  });
});
