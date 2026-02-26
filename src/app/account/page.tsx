'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function AccountContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
    }
    if (searchParams.get('success') === 'true') {
      setMessage('Thank you for subscribing! Your subscription is now active.');
    }
  }, [status, router, searchParams]);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || 'Could not open billing portal');
      }
    } catch {
      setMessage('Something went wrong');
    }
    setLoading(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const user = session.user as { subscriptionStatus?: string; name?: string; email?: string };
  const isSubscribed = user?.subscriptionStatus === 'active';

  return (
    <div>
      <h1>Your Account</h1>

      {message && <div>{message}</div>}

      <div>
        <h2>Profile</h2>
        <p>Name: {user?.name || 'Not set'}</p>
        <p>Email: {user?.email}</p>
      </div>

      <div>
        <h2>Subscription</h2>

        {isSubscribed ? (
          <div>
            <p>Active Subscriber</p>
            <p>You have access to all exclusive content.</p>
            <button onClick={handleManageSubscription} disabled={loading}>
              {loading ? 'Loading...' : 'Manage Subscription'}
            </button>
          </div>
        ) : (
          <div>
            <p>You are not currently subscribed. Subscribe to access exclusive content.</p>
            <Link href="/subscribe">Subscribe Now</Link>
          </div>
        )}
      </div>

      <button onClick={() => signOut({ callbackUrl: '/' })}>
        Sign Out
      </button>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
