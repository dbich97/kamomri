
import { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تواصل معنا - كم عمري',
  description: 'تواصل مع فريق عمل موقع "كم عمري". نستقبل استفساراتكم واقتراحاتكم لتحسين خدماتنا.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8 text-center md:text-right">
          تواصل معنا
        </h1>
        
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-md text-right">
          <p className="text-lg text-foreground mb-6 leading-relaxed">
            يسعدنا دائمًا أن نسمع منك! إذا كان لديك أي أسئلة، اقتراحات، أو ملاحظات حول موقع "كم عمري" 
            أو أدواتنا، فالرجاء عدم التردد في التواصل معنا. نحن نقدر مساهماتكم التي تساعدنا على تحسين 
            وتطوير خدماتنا بشكل مستمر.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-end">
                <Mail className="mr-2 h-5 w-5" />
                البريد الإلكتروني
              </h2>
              <p className="text-foreground">
                يمكنك مراسلتنا مباشرة عبر البريد الإلكتروني التالي:
                <br />
                <a href="mailto:contact@example.com" className="text-accent hover:underline break-all">
                  contact@example.com
                </a>
                <span className="text-sm text-muted-foreground block mt-1">
                  (ملاحظة: هذا عنوان بريد إلكتروني تجريبي، سيتم تحديثه بعنوان فعلي لاحقًا)
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-end">
                <MessageSquare className="mr-2 h-5 w-5" />
                وسائل التواصل الأخرى
              </h2>
              <p className="text-foreground">
                في الوقت الحالي، البريد الإلكتروني هو أفضل وسيلة للتواصل معنا. نعمل على توفير قنوات 
                اتصال إضافية في المستقبل لتسهيل تواصلكم معنا.
              </p>
            </div>
          </div>

          <p className="text-lg text-foreground mt-8 leading-relaxed">
            شكرًا لاهتمامك بموقع "كم عمري". نتطلع إلى رسائلكم!
          </p>
        </div>
      </div>
    </main>
  );
}
