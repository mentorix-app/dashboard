import { match } from '@formatjs/intl-localematcher';
import { jwtVerify } from 'jose';
import Negotiator from 'negotiator';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18n } from '@/i18n';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/** Routes that are accessible without authentication. */
const AUTH_PATHS = new Set(['/login', '/signup', '/forgot-password']);

/** Cookie name must match AUTH_SESSION_COOKIE in base.constants.ts. */
const AUTH_SESSION_COOKIE = 'auth_session';

const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_KEY = SESSION_SECRET ? new TextEncoder().encode(SESSION_SECRET) : null;

/**
 * Optimistic check: verifies the cookie is a valid, non-expired JWT signed
 * with SESSION_SECRET. Returns `false` for missing, malformed, or expired
 * cookies so the user is redirected to /login. Cheap enough for every request
 * (no DB calls, no upstream calls) — see Next.js auth guide §"Optimistic checks".
 */
async function hasValidSession(token: string | undefined): Promise<boolean> {
  if (!token || !SESSION_KEY) return false;
  try {
    await jwtVerify(token, SESSION_KEY, { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const locales = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  if (languages.length === 0) {
    return i18n.defaultLocale;
  }

  return match(languages, locales, i18n.defaultLocale);
}

function pathnameIsMissingLocale(pathname: string): boolean {
  return i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);
}

function localeFromPathname(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (segment && (i18n.locales as readonly string[]).includes(segment)) {
    return segment;
  }
  return i18n.defaultLocale;
}

const LOCALE_PATTERN = /^[a-z]{2,3}$/;

export default function proxy(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] ?? '';
  const validLocales = i18n.locales as readonly string[];

  if (pathnameIsMissingLocale(pathname)) {
    const locale = getLocale(request);

    const hasInvalidLocalePrefix =
      !!firstSegment && LOCALE_PATTERN.test(firstSegment) && !validLocales.includes(firstSegment);
    const targetPath = hasInvalidLocalePrefix ? '/' + segments.slice(1).join('/') : pathname;

    const target =
      !targetPath || targetPath === '/'
        ? new URL(`/${locale}`, request.url)
        : new URL(`/${locale}${targetPath}`, request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target);
  }

  // At this point pathname has a valid locale prefix.
  const locale = localeFromPathname(pathname);
  const pathWithoutLocale = '/' + segments.slice(1).join('/');
  const hasSession = await hasValidSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
  const isAuthPath = AUTH_PATHS.has(pathWithoutLocale);

  // Unauthenticated user trying to access a protected route → send to login.
  if (!isAuthPath && !hasSession) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Authenticated user on a login/signup page → send to dashboard.
  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  const response = intlMiddleware(request);
  response.headers.set('Content-Language', localeFromPathname(pathname));
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
