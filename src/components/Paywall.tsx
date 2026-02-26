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
        <p>Loading...</p>
      </div>
    );
  }

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <div>
      {preview}
      <div>
        <h3>Continue Reading with a Subscription</h3>
        <p>Get unlimited access to exclusive political analysis, breaking news, and in-depth reporting.</p>
        <div>
          {session ? (
            <Link href="/subscribe">Subscribe for $9.99/month</Link>
          ) : (
            <>
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/register">Create Account</Link>
            </>
          )}
        </div>
        <p>Already a subscriber? <Link href="/auth/signin">Sign in</Link></p>
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
