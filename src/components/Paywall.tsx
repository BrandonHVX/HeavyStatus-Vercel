'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

type PaywallProps = {
  children: React.ReactNode;
  preview?: React.ReactNode;
};

export function Paywall({ children, preview }: PaywallProps) {
  const { data: session, status } = useSession();
  
  const user = session?.user as { subscriptionStatus?: string } | undefined;
  const isSubscribed = user?.subscriptionStatus === 'active';

  if (status === 'loading') {
    return (
      <div>
        {preview}
        <div className="animate-pulse bg-gray-100 h-96 mt-8 rounded"></div>
      </div>
    );
  }

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {preview}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white pointer-events-none" style={{ height: '200px', top: '-200px' }}></div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 py-16 px-4 -mx-4 md:-mx-8 lg:-mx-16">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-serif mb-4">
            Continue Reading with a Subscription
          </h3>
          <p className="text-gray-600 mb-6">
            Get unlimited access to exclusive political analysis, breaking news, and in-depth reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/subscribe"
                className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
              >
                Subscribe for $9.99/month
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-block border border-black px-8 py-3 rounded hover:bg-gray-100 transition-colors"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Already a subscriber? <Link href="/auth/signin" className="underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function PaywallCheck({ isExclusive, children, preview }: { isExclusive: boolean; children: React.ReactNode; preview?: React.ReactNode }) {
  if (!isExclusive) {
    return <>{children}</>;
  }
  
  return <Paywall preview={preview}>{children}</Paywall>;
}
