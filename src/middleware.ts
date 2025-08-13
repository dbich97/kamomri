import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix, pathnames} from './navigation';
 
export default createMiddleware({
  defaultLocale: 'ar',
  locales,
  localePrefix,
  pathnames
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(ar|en|es|fr|de)/:path*',

    // Enable redirects that add a locale prefix
    // (e.g. `/about` -> `/en/about`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};