import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'timerflow_cookie_consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    
    // Here you would initialize analytics and ad services
    console.log('Cookies accepted - Initialize analytics and ads');
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsVisible(false);
    
    // Only essential cookies
    console.log('Cookies rejected - Essential only');
  };

  const handleClose = () => {
    // Treat close as rejection for GDPR compliance
    handleReject();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card p-6 rounded-xl border shadow-2xl backdrop-blur-xl bg-card/95">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Cookie className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Cookie Consent</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We use cookies to enhance your experience, analyze site traffic, and display personalized advertisements through Google AdSense. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </a>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Reject Non-Essential
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="flex-1 sm:flex-none"
                >
                  <a href="/privacy-policy">Learn More</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-medium">
                Cookie Details
              </summary>
              <div className="mt-3 space-y-3 text-muted-foreground">
                <div>
                  <strong className="text-foreground">Essential Cookies:</strong> Required for basic website functionality (theme preferences, timer settings). These cannot be disabled.
                </div>
                <div>
                  <strong className="text-foreground">Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics).
                </div>
                <div>
                  <strong className="text-foreground">Advertising Cookies:</strong> Used by Google AdSense to display relevant ads and measure ad performance.
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
