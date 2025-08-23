import { MetadataRoute } from 'next';
import { locales, pathnames } from './navigation';

const siteUrl = 'https://lazfan.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<keyof typeof pathnames> = ['/', '/about', '/contact', '/privacy'];

  const sitemapEntries = pages.flatMap((page) =>
    locales.map((locale) => {
      const path = pathnames[page];
      let pagePath: string;

      if (typeof path === 'string') {
        pagePath = path;
      } else {
        pagePath = path[locale];
      }

      if (pagePath === '/') pagePath = '';

      return {
        url: `${siteUrl}/${locale}${pagePath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '/' ? 1 : 0.8,
      };
    })
  );

  return sitemapEntries;
}
