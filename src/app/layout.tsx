
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header'; // Import the Header component

export const metadata: Metadata = {
  title: 'كم عمري | حاسبة العمر بالهجري والميلادي',
  description: 'موقع "كم عمري" يوفر أدوات لحساب العمر وتحويل التواريخ بين التقويمين الميلادي والهجري بدقة وسهولة.',
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
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Header /> {/* Add the Header component here */}
        <div className="flex-grow">
         {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
