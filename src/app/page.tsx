import { redirect } from 'next/navigation';
import { locales }from '@/navigation';

// This is the root page, it redirects to the default locale.
// The actual homepage is in src/app/[locale]/page.tsx
export default function RootPage() {
  // The default locale is the first one in the array.
  redirect(`/${locales[1]}`);
}
