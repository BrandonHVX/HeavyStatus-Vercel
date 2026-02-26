'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SubscriptionPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    const hasSubscription = (session?.user as { subscriptionStatus?: string } | undefined)?.subscriptionStatus === 'active';
    const hasDismissed = sessionStorage.getItem('subscription-prompt-dismissed');
    
    if (!hasSubscription && !hasDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [session, status]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('subscription-prompt-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div>
      <div>
        <button onClick={handleDismiss} aria-label="Close">&times;</button>
        
        <div>
          <p>Political Aficionado</p>
          <h2>Get Full Access</h2>
          <p>Register now for unlimited access to exclusive political analysis, in-depth articles, and premium content.</p>
          
          <div>
            {session ? (
              <Link href="/subscribe" onClick={handleDismiss}>Subscribe for $9.99/month</Link>
            ) : (
              <>
                <Link href="/auth/register" onClick={handleDismiss}>Create Free Account</Link>
                <Link href="/auth/signin" onClick={handleDismiss}>Sign In</Link>
              </>
            )}
          </div>
          
          <button onClick={handleDismiss}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}
