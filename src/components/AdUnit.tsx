'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT = 'ca-pub-9621492718805938';

const AD_SLOTS = {
  aboveFold: process.env.NEXT_PUBLIC_AD_SLOT_ABOVE_FOLD || '',
  inContent: process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT || '',
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '',
};

interface AdUnitProps {
  slot: 'aboveFold' | 'inContent' | 'sidebar' | string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', responsive = true, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  const slotId = AD_SLOTS[slot as keyof typeof AD_SLOTS] || slot;

  useEffect(() => {
    if (isLoaded.current || !slotId) return;
    
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [slotId]);

  if (!slotId) {
    return null;
  }

  return (
    <div ref={adRef} className={`ad-unit ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
