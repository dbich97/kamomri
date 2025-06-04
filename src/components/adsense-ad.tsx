
'use client';

import React, { useEffect } from 'react';

interface AdSenseAdProps {
  className?: string;
  style?: React.CSSProperties;
  publisherId: string;
  adSlotId: string;
  adFormat?: string;
}

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown, push: (p: object) => void }[];
  }
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  className,
  style,
  publisherId,
  adSlotId,
  adFormat = 'auto',
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      // يمكنك تسجيل الخطأ هنا إذا كنت ترغب في ذلك، ولكن كن حذرًا من إظهار الكثير من المعلومات في الإنتاج
      // console.error('Failed to push AdSense ad:', error);
    }
  }, [adSlotId, publisherId]); // إعادة التشغيل إذا تغير معرف الوحدة أو الناشر

  if (!publisherId || !adSlotId || !publisherId.startsWith("ca-pub-")) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={className} style={{
          padding: '20px',
          margin: '10px 0',
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          border: '1px dashed #ccc',
          color: '#333',
          ...style
        }}>
          <p style={{ fontWeight: 'bold' }}>AdSense Placeholder (وحدة إعلانية)</p>
          {(!publisherId || !publisherId.startsWith("ca-pub-")) && <p style={{ color: 'red', margin: '5px 0' }}>خطأ: `publisherId` غير صالح أو مفقود.</p>}
          {!adSlotId && <p style={{ color: 'red', margin: '5px 0' }}>خطأ: `adSlotId` مفقود.</p>}
          {publisherId && adSlotId && <p>الناشر: {publisherId}<br/>معرف الوحدة: {adSlotId}</p>}
          <p style={{ fontSize: '0.8em', marginTop: '10px' }}>هذا عنصر نائب. ستظهر الإعلانات على موقع مباشر ومعتمد.</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className} style={style} key={`${publisherId}-${adSlotId}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseAd;
