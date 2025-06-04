
import AgeCalculator from '@/components/age-calculator';
import AdSenseAd from '@/components/adsense-ad';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حاسبة العمر: كم عمري بالضبط بالهجري والميلادي؟',
  description: 'استخدم حاسبة "كم عمري" الدقيقة لمعرفة عمرك بالتفصيل (سنوات، أشهر، أيام) بالتقويمين الميلادي والهجري. أدخل تاريخ ميلادك واكتشف متى عيد ميلادك القادم!',
};

// !! استبدل هذه بالقيم الحقيقية من حساب AdSense الخاص بك !!
const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX";
const AD_SLOT_ID_1 = "YYYYYYYYYY"; // مثال لمعرف وحدة إعلانية
const AD_SLOT_ID_2 = "ZZZZZZZZZZ"; // مثال لمعرف وحدة إعلانية آخر

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <AgeCalculator />

      {/* مثال لوضع وحدة إعلانية أسفل الحاسبة */}
      {/* تأكد من أن ADSENSE_PUBLISHER_ID و AD_SLOT_ID_1 تم استبدالهما بقيم حقيقية */}
      <div className="my-8 w-full max-w-xl">
        <AdSenseAd
          publisherId={ADSENSE_PUBLISHER_ID}
          adSlotId={AD_SLOT_ID_1}
          className="h-[100px] md:h-[250px]" // يمكنك تعديل الارتفاع المتوقع هنا
        />
      </div>

      <section className="w-full max-w-3xl mt-12 mb-8 px-4 text-center md:text-right">
        <h1 className="text-3xl font-headline text-primary mb-6">حاسبة العمر الدقيقة – حساب عمرك بالسنوات والأيام</h1>
        
        <p className="text-lg text-foreground mb-4 leading-relaxed">
          موقع "كم عمري" هو أداتك المثالية لحساب عمرك بدقة وسهولة سواء بالتقويم الميلادي أو الهجري. هل تساءلت يومًا "كم عمري بالضبط بالسنوات والأشهر والأيام؟" أو "متى عيد ميلادي الهجري القادم؟". نقدم لك إجابات وافية ومفصلة.
        </p>

        <h2 className="text-2xl font-headline text-primary mt-8 mb-4">كيف تعمل حاسبة "كم عمري"؟</h2>
        <p className="text-lg text-foreground mb-6 leading-relaxed">
          ببساطة، اختر طريقة الإدخال المفضلة لديك (ميلادي أو هجري)، ثم أدخل تاريخ ميلادك باستخدام القوائم المنسدلة لليوم والشهر والسنة. بعد النقر على زر "احسب عمرك"، ستقوم أداتنا الذكية بعرض مجموعة من المعلومات القيمة حول عمرك.
        </p>

        {/* مثال لوضع وحدة إعلانية أخرى ضمن المحتوى */}
        {/* تأكد من أن ADSENSE_PUBLISHER_ID و AD_SLOT_ID_2 تم استبدالهما بقيم حقيقية */}
        <div className="my-8">
           <AdSenseAd
            publisherId={ADSENSE_PUBLISHER_ID}
            adSlotId={AD_SLOT_ID_2}
            className="h-[100px] md:h-[200px]" // يمكنك تعديل الارتفاع المتوقع هنا
          />
        </div>

        <h2 className="text-2xl font-headline text-primary mt-8 mb-4">ما الذي سأحصل عليه؟</h2>
        <div className="space-y-3 text-lg text-foreground mb-6 leading-relaxed">
          <p>عند استخدام حاسبة "كم عمري"، ستحصل على:</p>
          <ul className="list-disc list-inside pr-4 space-y-2">
            <li><strong>عمرك بالتقويم الميلادي:</strong> مفصلاً بالسنوات والأشهر والأيام.</li>
            <li><strong>عمرك بالتقويم الهجري:</strong> مفصلاً بالسنوات والأشهر والأيام.</li>
            <li><strong>تاريخ ميلادك المقابل:</strong> إذا أدخلت تاريخ ميلادك بالميلادي، ستعرض الأداة التاريخ الهجري الموافق له، والعكس صحيح.</li>
            <li><strong>عداد حي لعمرك:</strong> شاهد عمرك يتزايد أمام عينيك بالسنوات، الأشهر، الأيام، الساعات، الدقائق، وحتى الثواني!</li>
            <li><strong>العد التنازلي لعيد ميلادك القادم:</strong> استعد لاحتفالك القادم! تعرض الأداة الوقت المتبقي بدقة حتى عيد ميلادك القادم، سواء كان الميلادي أو الهجري، بناءً على طريقة إدخالك لتاريخ الميلاد.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-headline text-primary mt-8 mb-4">لماذا تستخدم موقع "كم عمري"؟</h2>
        <p className="text-lg text-foreground mb-4 leading-relaxed">
          صُممت أداة "كم عمري" لتكون سهلة الاستخدام بواجهة عربية بالكامل تدعم المحاذاة من اليمين لليسار. نحن نستخدم خوارزميات دقيقة لحساب العمر وتحويل التواريخ، مع الأخذ في الاعتبار تفاصيل التقويمين لتقديم نتائج موثوقة. سواء كنت ترغب في معرفة عمرك لمناسبة خاصة، أو لتتبع مرور الوقت، أو لمجرد الفضول، فإن "كم عمري" هو وجهتك الأولى.
        </p>
        <p className="text-sm text-muted-foreground mt-6">
          ملاحظة: حساب العمر بالتقويم الهجري يعتمد على التقويم الهجري الحسابي (المدني) وقد يختلف بيوم واحد عن التقويم المعتمد على رؤية الهلال مثل تقويم أم القرى. استمتع بمعرفة تفاصيل عمرك وشارك الموقع مع أصدقائك!
        </p>
      </section>
    </main>
  );
}
