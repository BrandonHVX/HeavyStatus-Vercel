'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubscribePage() {
  const { data: session, status } = useSession();
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
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const user = session?.user as any;
  const isSubscribed = user?.subscriptionStatus === 'active';

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-serif mb-4">You're Already Subscribed</h1>
          <p className="text-gray-600 mb-6">
            You have access to all exclusive content.
          </p>
          <Link
            href="/account"
            className="inline-block border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
          >
            Manage Subscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Become a Member</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to exclusive articles, in-depth analysis, and premium content.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        <div className="max-w-md mx-auto">
          <div className="border-2 border-black rounded-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif mb-2">Premium Membership</h2>
              <div className="text-4xl font-bold mb-1">
                $9.99<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-500">Cancel anytime</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited access to exclusive articles</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>In-depth political analysis</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Early access to breaking news</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ad-free reading experience</span>
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : session ? 'Subscribe Now' : 'Sign In to Subscribe'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
