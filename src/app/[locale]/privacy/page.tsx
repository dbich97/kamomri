
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { Link } from '@/navigation';


export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}


export default async function PrivacyPolicyPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('PrivacyPage');
  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8 text-center md:text-right">
          {t('title')}
        </h1>
        
        <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground leading-relaxed space-y-6 text-right">
          <p>{t('p1')}</p>

          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('processedInfoTitle')}</h2>
          <p>{t.rich('processedInfoDesc', {
            strong: (chunks) => <strong>{chunks}</strong>
          })}</p>


          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('cookiesTitle')}</h2>
          <p>{t('cookiesDesc')}</p>

          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('sharingTitle')}</h2>
          <p>{t('sharingDesc')}</p>
          
          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('linksTitle')}</h2>
          <p>{t('linksDesc')}</p>

          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('securityTitle')}</h2>
          <p>{t('securityDesc')}</p>

          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('changesTitle')}</h2>
          <p>{t('changesDesc')}</p>

          <h2 className="text-2xl font-headline text-primary mt-6 mb-3">{t('contactTitle')}</h2>
          <p>
            {t.rich('contactDesc', {
              link: (chunks) => <Link href="/contact" className="text-primary hover:underline">{chunks}</Link>
            })}
          </p>
          <p className="mt-4 text-sm">
            {t('lastUpdated')} <time dateTime="2024-07-27">27 يوليو 2024</time>
          </p>
        </article>
      </div>
    </main>
  );
}
