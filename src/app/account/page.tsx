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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as { subscriptionStatus?: string; name?: string; email?: string };
  const isSubscribed = user?.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-serif mb-8">Your Account</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            {message}
          </div>
        )}

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Profile</h2>
          <div className="space-y-2">
            <p><span className="text-gray-500">Name:</span> {user?.name || 'Not set'}</p>
            <p><span className="text-gray-500">Email:</span> {user?.email}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Subscription</h2>
          
          {isSubscribed ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium text-green-700">Active Subscriber</span>
              </div>
              <p className="text-gray-600 mb-4">
                You have access to all exclusive content.
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={loading}
                className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                You are not currently subscribed. Subscribe to access exclusive content.
              </p>
              <Link
                href="/subscribe"
                className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-gray-600 hover:text-black transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <AccountContent />
    </Suspense>
  );
}
