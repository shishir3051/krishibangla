import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, hasLocale, LOCALE_COOKIE } from '@/lib/i18n';

/**
 * Locale routing:
 * - /crop/:id (old URLs) → 308 → /crops/:id (permanent move, locale-independent so browsers can cache it)
 * - paths without a locale → 307 → /{NEXT_LOCALE cookie, else bn}/path
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacyCrop = pathname.match(/^\/crop\/([^/]+)\/?$/);
  if (legacyCrop) {
    const url = request.nextUrl.clone();
    url.pathname = `/crops/${legacyCrop[1]}`;
    return NextResponse.redirect(url, 308);
  }

  if (hasLocale(pathname.split('/')[1])) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (public assets, favicon, sitemap.xml…).
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
