import { NextResponse, type NextRequest } from 'next/server';
import { resolveAppOrigin, startAppleSignIn } from '@/src/entities/auth/server/apple';
import { getSession } from '@/src/entities/auth/server/dal';
import { ROUTES } from '@/src/shared/lib';

/**
 * Sends the browser to Apple's authorization page (see `startAppleSignIn`).
 * `?intent=delete` asks Apple for a fresh authorization to delete the account, which only a signed-in person may do.
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  if (request.nextUrl.searchParams.get('intent') !== 'delete') {
    return NextResponse.redirect(await startAppleSignIn(request.nextUrl.origin));
  }

  if (!(await getSession())) {
    return NextResponse.redirect(new URL(ROUTES.login, resolveAppOrigin(request.nextUrl.origin)), 303);
  }
  return NextResponse.redirect(await startAppleSignIn(request.nextUrl.origin, 'delete'));
};
