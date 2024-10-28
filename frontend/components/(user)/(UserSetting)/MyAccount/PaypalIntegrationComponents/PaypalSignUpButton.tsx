'use client';
import { Button } from '@/components/ui/button';
import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';
import { getSignUpPaypalUrl } from '@/lib/API/payments';
import ServerFetch from '@/utils/ServerFetch';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type props = {
  isVerified: boolean;
};

const PayPalSignUpButton = ({ isVerified }: props) => {
  const [actionUrl, setActionUrl] = useState<string>('');
  useEffect(() => {
    const scriptId = 'paypal-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = 'https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js';
      document.body.appendChild(script);
    }

    const getData = async () => {
      const data = await getSignUpPaypalUrl();
      if (data.data) {
        const url = data.data.links.filter((item: any) => item.rel === 'action_url')[0]['href'];
        console.log(url);
        setActionUrl(url);
      }
    };
    getData();
  }, []);

  console.log(actionUrl);

  return (
    <Button
      className="h-12 w-full rounded-md font-semibold text-white transition-all duration-300 ease-in-out"
      style={{
        background: 'linear-gradient(to right, #0070ba, #1546a0)',
        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
      disabled={isVerified}
    >
      {isVerified ? (
        'Đã liên kết với PayPal'
      ) : (
        <Link data-paypal-button="true" href={`${actionUrl}&displayMode=minibrowser`} target="PPFrame">
          Liên kết với PayPal
        </Link>
      )}
    </Button>
  );
};

export default PayPalSignUpButton;
