
import { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تواصل معنا - كم عمري',
  description: 'هل لديك سؤال أو اقتراح؟ تواصل مع فريق موقع "كم عمري". نسعد باستقبال رسائلك ونسعى للرد في أقرب وقت ممكن.',
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
            نحن في "كم عمري" نقدر تواصلك واهتمامك! سواء كان لديك استفسار، أو اقتراح لتطوير خدماتنا، 
            أو حتى مجرد رغبة في إلقاء التحية، فإننا نرحب بك. فريقنا مستعد دائمًا للاستماع إليك والرد 
            على رسائلك في أقرب وقت ممكن.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-end">
                <Mail className="mr-2 h-5 w-5" />
                عبر البريد الإلكتروني
              </h2>
              <p className="text-foreground">
                أرسل لنا رسالة مباشرة عبر البريد الإلكتروني التالي. نحن نحرص على مراجعة جميع الرسائل بعناية.
                <br />
                <a href="mailto:info@example.com" className="text-accent hover:underline break-all">
                  info@example.com
                </a>
                <span className="text-sm text-muted-foreground block mt-1">
                  (نرجو ملاحظة أن هذا عنوان بريد إلكتروني تجريبي. سيتم تحديثه بعنوان فعلي قريبًا.)
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-end">
                <MessageSquare className="mr-2 h-5 w-5" />
                قنوات تواصل إضافية
              </h2>
              <p className="text-foreground">
                حاليًا، يعتبر البريد الإلكتروني هو الوسيلة الرئيسية للتواصل معنا. نعمل باستمرار على 
                توسيع قنوات اتصالنا لتشمل منصات أخرى في المستقبل لتلبية احتياجاتكم بشكل أفضل. 
                تابعنا لمعرفة آخر التحديثات!
              </p>
            </div>
          </div>

          <p className="text-lg text-foreground mt-8 leading-relaxed">
            شكرًا جزيلاً لثقتك بموقع "كم عمري". نحن هنا لخدمتك ونتطلع دائمًا لسماع صوتك!
          </p>
        </div>
      </div>
    </main>
  );
}
