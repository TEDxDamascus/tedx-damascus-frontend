import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import createMiddleware from 'next-intl/middleware';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
