import { defineRouting } from 'next-intl/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
