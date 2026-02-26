'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function SubscribeContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setError('Checkout was canceled. You can try again when ready.');
    }
  }, [searchParams]);

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/subscribe');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Could not start checkout');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const user = session?.user as { subscriptionStatus?: string } | undefined;
  const isSubscribed = user?.subscriptionStatus === 'active';

  if (isSubscribed) {
    return (
      <div>
        <h1>You&apos;re Already Subscribed</h1>
        <p>You have access to all exclusive content.</p>
        <Link href="/account">Manage Subscription</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Become a Member</h1>
      <p>Get unlimited access to exclusive articles, in-depth analysis, and premium content.</p>

      {error && <div>{error}</div>}

      <div>
        <h2>Premium Membership</h2>
        <div>$9.99/month</div>
        <p>Cancel anytime</p>

        <ul>
          <li>Unlimited access to exclusive articles</li>
          <li>In-depth political analysis</li>
          <li>Early access to breaking news</li>
          <li>Ad-free reading experience</li>
        </ul>

        <button onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Loading...' : session ? 'Subscribe Now' : 'Sign In to Subscribe'}
        </button>

        <p>Secure payment powered by Stripe</p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscribeContent />
    </Suspense>
  );
}
