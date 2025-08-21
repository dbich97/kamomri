import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // إذا زار المستخدم الرابط الرئيسي فقط "/"
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/fr'; // تغيير اللغة حسب ما تريده: /en أو /ar أو /fr
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
