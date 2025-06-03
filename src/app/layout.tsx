import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'كم عمري - حاسبة دقيقة للعمر بالهجري والميلادي',
  description: 'موقع كم عمري يساعدك على حساب عمرك بدقة بالتقويم الميلادي والهجري. أدخل تاريخ ميلادك واكتشف عمرك بالسنوات والأشهر والأيام، مع عداد حي وعيد ميلادك القادم.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
