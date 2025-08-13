
'use client';

import { usePathname, useRouter, locales } from '@/navigation';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

// Mapping locale codes to their full names
const localeNames: { [key: string]: string } = {
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select onValueChange={handleLocaleChange} defaultValue={locale}>
      <SelectTrigger className="w-auto border-0 bg-transparent focus:ring-0 focus:ring-offset-0 gap-2">
         <Globe className="h-5 w-5 text-primary" />
         <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent align="end">
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
