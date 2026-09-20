/** @jest-environment node */

jest.mock('../../../../../src/shared/api', () => ({
  MENTORIX_API_BASE_URL: 'https://backend.test',
}));

import { NextRequest } from 'next/server';

import { GET } from '../route';

const buildRequest = (query: string): NextRequest =>
  new NextRequest(new URL(`/api/public/client-stats${query}`, 'http://localhost'));

describe('public client statistics route', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('forwards the signed query string unchanged without authorization', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ expires_at: '2026-09-20T12:00:00Z' }), {
        headers: { 'content-type': 'application/json' },
      })
    );
    const query = '?client_user_id=a%2Fb&trainer_id=trainer&exp=123&sig=a%2Bb%3D';

    const response = await GET(buildRequest(query));

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backend.test/client/analytics${query}`,
      expect.objectContaining({ method: 'GET', cache: 'no-store' })
    );
    const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    expect(new Headers(init.headers).has('Authorization')).toBe(false);
    expect(await response.json()).toEqual({ expiresAt: '2026-09-20T12:00:00Z' });
  });

  it.each([400, 401, 404])('preserves a %i response for in-page error handling', async (status) => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ detail: 'request rejected' }), {
        status,
        headers: { 'content-type': 'application/json' },
      })
    );

    const response = await GET(buildRequest('?client_user_id=a&trainer_id=b&exp=123&sig=c'));

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ detail: 'request rejected' });
  });
});
