import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface GoogleLoginProps {
  onSuccess: (token: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleLogin({ onSuccess, disabled }: GoogleLoginProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.error('Google Client ID not configured');
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: googleButtonRef.current.offsetWidth,
            text: 'continue_with',
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      onSuccess(response.credential);
    }
  };

  if (!clientId) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled>
        Google Sign In (Not Configured)
      </Button>
    );
  }

  return (
    <div 
      ref={googleButtonRef} 
      className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    />
  );
}
