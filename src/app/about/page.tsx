
import { Metadata } from 'next';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('AboutPage');
  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8 text-center md:text-right">
          {t('title')}
        </h1>
        
        <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground leading-relaxed space-y-6 text-right">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
          <p>
            {t.rich('p4', {
              link: (chunks) => <Link href="/contact" className="text-primary hover:underline">{chunks}</Link>
            })}
          </p>
        </article>
      </div>
    </main>
  );
}
