import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './navigation';

export type Locale = (typeof locales)[number];
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
