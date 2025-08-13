
'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('AgeCalculator');
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      // You can log the error here if you wish, but be careful not to expose too much information in production
      // console.error('Failed to push AdSense ad:', error);
    }
  }, [adSlotId, publisherId]);

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
          <p style={{ fontWeight: 'bold' }}>{t('adPlaceholderText')}</p>
          {(!publisherId || !publisherId.startsWith("ca-pub-")) && <p style={{ color: 'red', margin: '5px 0' }}>{t('adPlaceholderErrorInvalidId', { name: 'publisherId' })}</p>}
          {!adSlotId && <p style={{ color: 'red', margin: '5px 0' }}>{t('adPlaceholderErrorId', { name: 'adSlotId' })}</p>}
          {publisherId && adSlotId && <p>{t('adPlaceholderInfo', { publisherId, adSlotId })}</p>}
          <p style={{ fontSize: '0.8em', marginTop: '10px' }}>{t('adPlaceholderNote')}</p>
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

    