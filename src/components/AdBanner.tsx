import { cn } from '@/lib/utils';

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

  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-dashed border-border/50 rounded-xl overflow-hidden backdrop-blur-sm',
        heights[position],
        widths[format],
        'hover:border-border/80 transition-all duration-300',
        className
      )}
      aria-label={descriptions[position]}
      role="complementary"
    >
      {/* Ad placeholder for future AdSense integration */}
      <div className="text-center space-y-2 p-4">
        <div className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wide">
          Advertisement
        </div>
        <div className="text-sm text-muted-foreground/80 font-medium">
          {position === 'header' && 'Leaderboard Ad (728x90)'}
          {position === 'middle' && 'Banner Ad (468x60)'}
          {position === 'footer' && 'Leaderboard Ad (728x90)'}
          {position === 'sidebar' && 'Skyscraper Ad (160x600)'}
        </div>
        <div className="text-xs text-muted-foreground/60">
          Google AdSense Placeholder
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-border/30 rounded-tl" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-border/30 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-border/30 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-border/30 rounded-br" />

      {/* 
        TODO: Replace with actual AdSense code after approval
        Example AdSense script:
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
                crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
    </div>
  );
}
