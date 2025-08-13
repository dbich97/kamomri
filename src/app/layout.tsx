// This is the root layout, it doesn't have locale.
// It's used for the not-found page and the root redirect.

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'كم عمري | حاسبة العمر بالهجري والميلادي',
  description: 'موقع "كم عمري" يوفر أدوات لحساب العمر وتحويل التواريخ بين التقويمين الميلادي والهجري بدقة وسهولة.',
};

const ADSENSE_PUBLISHER_ID = "ca-pub-7009948592297613";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang and dir attributes are now on the next level down in src/app/[locale]/layout.tsx
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
        {/* AdSense Script */}
        {ADSENSE_PUBLISHER_ID.startsWith("ca-pub-") && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {/* The header is now in the locale-specific layout */}
        <div className="flex-grow">
         {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
