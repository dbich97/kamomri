import { MetadataRoute } from 'next';
import { locales, pathnames } from './navigation';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kam-omri.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each page and each locale
  Object.keys(pathnames).forEach(route => {
    locales.forEach(locale => {
      // For the root path, just use the locale
      const path = route === '/' ? '' : (pathnames[route as keyof typeof pathnames] as any)[locale];
      
      // Ensure we don't double up on root paths with a slash
      if (route === '/' && path !== '') return;

      const url = `${siteUrl}/${locale}${path}`;
      
      // Create alternating language links for each entry
      const alternates: { [key: string]: string } = {};
      locales.forEach(altLocale => {
        const altPath = route === '/' ? '' : (pathnames[route as keyof typeof pathnames] as any)[altLocale];
        alternates[altLocale] = `${siteUrl}/${altLocale}${altPath}`;
      });

      sitemapEntries.push({
        url: url,
        lastModified: new Date(),
        alternates: {
  languages: alternates,
},
      });
    });
  });
  
  return sitemapEntries;
}
