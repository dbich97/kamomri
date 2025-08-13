import {unstable_setRequestLocale} from 'next-intl/server';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import { locales } from '@/navigation';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';

// If you have a font variable, you can define it here.
// const inter = Inter({ subsets: ['latin'] })

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
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // The <html> and <body> tags are defined in the root layout (src/app/layout.tsx)
  // This layout should only contain the components specific to the locale.
  return (
    <>
        <Header />
        <div className="flex-grow">
         {children}
        </div>
        <Toaster />
    </>
  );
}
