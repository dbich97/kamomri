import {unstable_setRequestLocale} from 'next-intl/server';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import { locales } from '@/app/navigation';
import { notFound } from 'next/navigation';
import {NextIntlClientProvider, useMessages} from 'next-intl';

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  unstable_setRequestLocale(locale);
  const messages = useMessages();

  // The <html> and <body> tags are defined in the root layout (src/app/layout.tsx)
  // This layout should only contain the components specific to the locale.
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
        <Header />
        <div className="flex-grow">
         {children}
        </div>
        <Toaster />
    </NextIntlClientProvider>
  );
}
