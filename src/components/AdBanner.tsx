import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface AdBannerProps {
  position: 'header' | 'middle' | 'footer' | 'sidebar';
  className?: string;
  format?: 'horizontal' | 'vertical' | 'square';
}

export function AdBanner({ position, className, format = 'horizontal' }: AdBannerProps) {
  const heights = {
    header: 'h-24 md:h-28',
    middle: 'h-32 md:h-40',
    footer: 'h-24 md:h-28',
    sidebar: 'h-64 md:h-96',
  };

  const widths = {
    horizontal: 'w-full',
    vertical: 'w-40 md:w-48',
    square: 'w-64 aspect-square',
  };

  const descriptions = {
    header: 'Header Advertisement',
    middle: 'Content Advertisement',
    footer: 'Footer Advertisement',
    sidebar: 'Sidebar Advertisement',
  };

  // Push AdSense after mount for each ad block
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  // Map suggested slot sizes per position; replace with real slot IDs
  const slotByPosition: Record<AdBannerProps['position'], string> = {
    header: 'YOUR_SLOT_ID_LEADERBOARD',
    middle: 'YOUR_SLOT_ID_IN_CONTENT',
    footer: 'YOUR_SLOT_ID_FOOTER',
    sidebar: 'YOUR_SLOT_ID_SIDEBAR',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        heights[position],
        widths[format],
        className
      )}
      aria-label={descriptions[position]}
      role="complementary"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9807181998947271"
        data-ad-slot={slotByPosition[position]}
        data-ad-format={format === 'horizontal' ? 'auto' : format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
