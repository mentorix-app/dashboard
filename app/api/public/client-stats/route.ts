import { type NextRequest, NextResponse } from 'next/server';

import { MENTORIX_API_BASE_URL } from '@/src/shared/api';
import { convertObjectKeys, toCamelCase } from '@/src/shared/lib';

const baseUrl = MENTORIX_API_BASE_URL.replace(/\/$/, '');

const isJson = (headers: Headers): boolean => (headers.get('content-type') ?? '').includes('application/json');

export const GET = async (request: NextRequest): Promise<Response> => {
  const upstream = await fetch(`${baseUrl}/client/analytics${request.nextUrl.search}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!isJson(upstream.headers)) {
    return new NextResponse(upstream.body, { status: upstream.status, statusText: upstream.statusText });
  }

  const text = await upstream.text();
  const payload = text ? JSON.stringify(convertObjectKeys(JSON.parse(text) as unknown, toCamelCase)) : null;

  return new NextResponse(payload, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: { 'content-type': 'application/json' },
  });
};
