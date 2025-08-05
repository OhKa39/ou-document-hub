'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ServerFetch from '@/utils/ServerFetch';
import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/components/providers/UserProvider';

export default function PayPalSignUpButton({ isVerified }: { isVerified: boolean }) {
  const { user } = useUserStore((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) setError(decodeURIComponent(errorParam));
  }, []);

  const handleSignUp = async () => {
    if (isVerified || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await ServerFetch(`${PAYMENT_ENDPOINT}/customer/partner-referrals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: document.cookie,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data?.links) {
          const signUpLink = data.data.links.find((link: any) => link.rel === 'action_url')?.href;
          if (signUpLink) {
            window.location.href = signUpLink; // Redirect to PayPal onboarding
          } else {
            throw new Error('No sign-up link found in response');
          }
        } else {
          throw new Error(data.message || 'Failed to generate sign-up link');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to initiate PayPal sign-up`);
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleSignUp} disabled={isVerified || loading} className="w-full">
        {loading ? 'Processing...' : isVerified ? 'Already Verified' : 'Connect PayPal Account'}
      </Button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
