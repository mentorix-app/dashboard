import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18n } from '@/i18n';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const locales = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

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

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathnameIsMissingLocale(pathname)) {
    const locale = getLocale(request);
    const target =
      pathname === '/' ? new URL(`/${locale}`, request.url) : new URL(`/${locale}${pathname}`, request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target);
  }

  const response = intlMiddleware(request);
  response.headers.set('Content-Language', localeFromPathname(pathname));
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
