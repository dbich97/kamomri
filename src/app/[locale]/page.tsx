
import AgeCalculator from '@/components/age-calculator';
import AdSenseAd from '@/components/adsense-ad';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';

// !! استبدل هذه بالقيم الحقيقية من حساب AdSense الخاص بك !!
const ADSENSE_PUBLISHER_ID = "ca-pub-7009948592297613";
const AD_SLOT_ID_1 = "5474745346"; // 300x250 or responsive
const AD_SLOT_ID_2 = "5474745346"; // Same responsive ad for in-article
const AD_SLOT_ID_LEFT_SKYSCRAPER = "4208128655"; // 160x600
const AD_SLOT_ID_RIGHT_SKYSCRAPER = "4208128655"; // 160x600

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}


export default async function Home({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('HomePage');

  return (
    <main className="min-h-screen bg-background text-foreground p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="flex flex-row justify-center items-start gap-x-8 w-full max-w-screen-xl mx-auto">

        {/* Left Skyscraper Ad - Visible on Desktop */}
        <aside className="hidden lg:block w-[160px] flex-shrink-0 pt-8">
          <div className="sticky top-24"> {/* top value depends on header height + desired spacing */}
            <AdSenseAd
              publisherId={ADSENSE_PUBLISHER_ID}
              adSlotId={AD_SLOT_ID_LEFT_SKYSCRAPER}
              className="w-[160px] h-[600px]" // Standard Skyscraper size
            />
          </div>
        </aside>

        {/* Central Content Column (Tool + Textual Content) */}
        <div className="flex flex-col items-center flex-grow w-full min-w-0">
          {/* Age Calculator and its ad */}
          <div className="w-full max-w-xl">
            <AgeCalculator />
            <div className="my-8 w-full">
              <AdSenseAd
                publisherId={ADSENSE_PUBLISHER_ID}
                adSlotId={AD_SLOT_ID_1}
                className="h-[100px] md:h-[250px]"
              />
            </div>
          </div>

          {/* Text content sections */}
          <section className="w-full max-w-3xl mt-4 mb-8 md:px-4 text-center md:text-right">
            <h1 className="text-3xl font-headline text-primary mb-6">{t('mainTitle')}</h1>
            
            <p className="text-lg text-foreground mb-4 leading-relaxed">
              {t('intro')}
            </p>

            <h2 className="text-2xl font-headline text-primary mt-8 mb-4">{t('howItWorksTitle')}</h2>
            <p className="text-lg text-foreground mb-6 leading-relaxed">
              {t('howItWorksDesc')}
            </p>

            <div className="my-8">
              <AdSenseAd
                publisherId={ADSENSE_PUBLISHER_ID}
                adSlotId={AD_SLOT_ID_2}
                className="h-[100px] md:h-[200px]"
              />
            </div>

            <h2 className="text-2xl font-headline text-primary mt-8 mb-4">{t('whatYouGetTitle')}</h2>
            <div className="space-y-3 text-lg text-foreground mb-6 leading-relaxed">
              <p>{t('whatYouGetIntro')}</p>
              {t.rich('whatYouGetPoints', {
                  strong: (chunks) => <strong>{chunks}</strong>,
                  ul: (chunks) => <ul className="list-disc list-inside pr-4 space-y-2">{chunks}</ul>,
                  li: (chunks) => <li>{chunks}</li>
              })}
            </div>

            <h2 className="text-2xl font-headline text-primary mt-8 mb-4">{t('whyUseTitle')}</h2>
            <p className="text-lg text-foreground mb-4 leading-relaxed">
             {t('whyUseDesc1')}
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              {t('whyUseDesc2')}
            </p>
          </section>
        </div>

        {/* Right Skyscraper Ad - Visible on Desktop */}
        <aside className="hidden lg:block w-[160px] flex-shrink-0 pt-8">
          <div className="sticky top-24">
            <AdSenseAd
              publisherId={ADSENSE_PUBLISHER_ID}
              adSlotId={AD_SLOT_ID_RIGHT_SKYSCRAPER}
              className="w-[160px] h-[600px]" // Standard Skyscraper size
            />
          </div>
        </aside>

      </div>
    </main>
  );
}
