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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white max-w-md w-full mx-4 p-8 shadow-2xl relative animate-fade-in">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[#c41e3a] font-medium mb-4">
            Political Aficionado
          </p>
          
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#050505] mb-4">
            Get Full Access
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Register now for unlimited access to exclusive political analysis, in-depth articles, and premium content.
          </p>
          
          <div className="space-y-3">
            {session ? (
              <Link
                href="/subscribe"
                onClick={handleDismiss}
                className="block w-full bg-[#050505] text-white py-3 px-6 font-medium hover:bg-[#1a1a1a] transition-colors"
              >
                Subscribe for $9.99/month
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  onClick={handleDismiss}
                  className="block w-full bg-[#050505] text-white py-3 px-6 font-medium hover:bg-[#1a1a1a] transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/auth/signin"
                  onClick={handleDismiss}
                  className="block w-full border border-[#050505] text-[#050505] py-3 px-6 font-medium hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
          
          <button
            onClick={handleDismiss}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
