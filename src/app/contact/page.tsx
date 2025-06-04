
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
            في "كم عمري"، نسعد دائمًا بسماع صوتك! سواء كان لديك سؤال، فكرة رائعة لتطوير الموقع، 
            أو حتى رغبة في إلقاء التحية، فريقنا هنا للاستماع والرد. 
            نحن نؤمن بأن تواصلكم هو مفتاح تطورنا، ونتطلع لتلقي رسائلكم القيمة.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-start">
                <Mail className="ml-2 h-5 w-5" />
                عبر البريد الإلكتروني
              </h2>
              <p className="text-foreground">
                لأية استفسارات أو اقتراحات، يمكنكم مراسلتنا مباشرة على العنوان التالي. 
                نلتزم بمراجعة كافة الرسائل بعناية والرد عليها في أقرب فرصة.
                <br />
                <a href="mailto:support@kam-omri.com" className="text-accent hover:underline break-all">
                  support@kam-omri.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-start">
                <MessageSquare className="ml-2 h-5 w-5" />
                قنوات تواصل مستقبلية
              </h2>
              <p className="text-foreground">
                نعمل حاليًا على توسيع قنوات التواصل لتشمل منصات إضافية تتيح لنا خدمتك بشكل أفضل وأسرع. 
                ترقبوا تحديثاتنا! في الوقت الحالي، يظل البريد الإلكتروني هو وسيلتنا الأساسية للتواصل الفعال.
              </p>
            </div>
          </div>

          <p className="text-lg text-foreground mt-8 leading-relaxed">
            شكرًا لثقتكم بموقع "كم عمري". ملاحظاتكم واقتراحاتكم هي مصدر إلهام لنا، ونتطلع دائمًا للمساهمة في جعل تجربتكم أفضل.
          </p>
        </div>
      </div>
    </main>
  );
}

