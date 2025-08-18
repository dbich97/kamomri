
import { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('ContactPage');
  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8 text-center md:text-right">
          {t('title')}
        </h1>
        
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-md text-right">
          <p className="text-lg text-foreground mb-6 leading-relaxed">
            {t('p1')}
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-start">
                <Mail className="ml-2 h-5 w-5" />
                {t('emailTitle')}
              </h2>
              <p className="text-foreground">
                {t('emailDesc')}
                <br />
                <a href="mailto:support@kam-omri.com" className="text-accent hover:underline break-all">
                  support@kam-omri.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-start">
                <MessageSquare className="ml-2 h-5 w-5" />
                {t('futureTitle')}
              </h2>
              <p className="text-foreground">
                {t('futureDesc')}
              </p>
            </div>
          </div>

          <p className="text-lg text-foreground mt-8 leading-relaxed">
            {t('p2')}
          </p>
        </div>
      </div>
    </main>
  );
}
