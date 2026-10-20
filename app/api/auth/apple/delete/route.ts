import { NextResponse, type NextRequest } from 'next/server';
import { isDeleteAccountErrorCode } from '@/src/entities/auth/auth.utils';
import { completeAppleAccountDeletion, resolveAppOrigin } from '@/src/entities/auth/server/apple';
import { getSession } from '@/src/entities/auth/server/dal';
import { ROUTES } from '@/src/shared/lib';

/**
 * Second half of deleting an account with an Apple sign-in: the callback has checked Apple's
 * answer and left it in a cookie; this GET, which carries the session cookie, deletes the
 * account with it. The answer is a 303 to the login page once the account is gone, or back to the
 * account page with the reason. `?error=` is a failure the callback already found.
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  const origin = resolveAppOrigin(request.nextUrl.origin);

  const reported = request.nextUrl.searchParams.get('error');
  const result = isDeleteAccountErrorCode(reported)
    ? ({ ok: false, errorCode: reported } as const)
    : await completeAppleAccountDeletion(request.nextUrl.origin);

  let target: string = `${ROUTES.login}?deleted=1`;
  if (!result.ok) {
    const session = await getSession();
    target = session ? `${ROUTES.userAccount(session.userId)}?deleteError=${result.errorCode}` : ROUTES.login;
  }
  return NextResponse.redirect(new URL(target, origin), 303);
};
