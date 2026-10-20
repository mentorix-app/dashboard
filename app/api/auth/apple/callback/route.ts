import { NextResponse, type NextRequest } from 'next/server';
import { APPLE_DELETION_PATH } from '@/src/entities/auth/server/oauth.constants';
import {
  acceptAppleDeletionProof,
  completeAppleSignIn,
  resolveAppOrigin,
  takeAppleIntent,
} from '@/src/entities/auth/server/apple';
import { ROUTES } from '@/src/shared/lib';

/**
 * Return URL of Sign in with Apple. Apple posts a form here (`response_mode=form_post`);
 * the answer is a 303 so the browser follows it with a GET: to the dashboard on success or back
 * to the login page with a failure code. When the round trip was a fresh authorization to delete
 * the account, the browser goes on to the route that deletes it (this POST carries no session cookie).
 */
export const POST = async (request: NextRequest): Promise<Response> => {
  const origin = resolveAppOrigin(request.nextUrl.origin);

  const intent = await takeAppleIntent();
  const form = await request.formData().catch(() => null);

  if (intent === 'delete') {
    const accepted = form ? await acceptAppleDeletionProof(form) : null;
    const target =
      accepted?.ok === true
        ? APPLE_DELETION_PATH
        : `${APPLE_DELETION_PATH}?error=${accepted?.errorCode ?? 'apple_failed'}`;
    return NextResponse.redirect(new URL(target, origin), 303);
  }

  const result = form ? await completeAppleSignIn(form) : null;

  const target = result?.ok ? ROUTES.dashboard : `${ROUTES.login}?error=${result?.errorCode ?? 'apple_failed'}`;
  return NextResponse.redirect(new URL(target, origin), 303);
};
