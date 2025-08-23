import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/; // عشان ما يعمل redirect للملفات مثل .js, .css

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // تجاهل الملفات العامة و API
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // إذا الرابط بدون لغة (مثلاً /about أو /privacy)
  const pathnameHasLocale = /^\/(en|fr|ar)(\/|$)/.test(pathname);

  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`; // غيّر "en" للغة الافتراضية عندك
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
