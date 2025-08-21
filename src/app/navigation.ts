import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';

export const locales = ['en', 'ar', 'es', 'fr', 'de'] as const;
export const localePrefix = 'always'; // Default

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same path, use
  // the special `/` pathname.
  '/': '/',
  
  // If locales use different paths, specify
  // them separately for each locale.
  '/about': {
    en: '/about',
    ar: '/about-us',
    es: '/sobre-nosotros',
    fr: '/a-propos',
    de: '/ueber-uns'
  },
  '/contact': {
    en: '/contact',
    ar: '/contact',
    es: '/contact',
    fr: '/contact',
    de: '/contact'
  },
  '/privacy': {
    en: '/privacy',
    ar: '/privacy',
    es: '/privacy',
    fr: '/privacy',
    de: '/privacy'
  },

} satisfies Pathnames<typeof locales>;

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
