'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const SuccessPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderDetailsParam = query.get('orderDetails');
    if (orderDetailsParam) {
      try {
        const parsedDetails = JSON.parse(decodeURIComponent(orderDetailsParam));
        setOrderDetails(parsedDetails);
      } catch (error) {
        console.error('Failed to parse order details:', error);
        router.push('/cart'); // Redirect to cart if parsing fails
      }
    } else {
      router.push('/cart'); // Redirect to cart if no order details
    }
  }, [router]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const paymentMethodDisplay = orderDetails.paymentMethod === 'CASH' ? 'Cash' : 'PayPal';

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Success Card */}
      <div className="w-full max-w-md rounded-lg bg-white p-16 shadow-lg">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-xl text-gray-500">Thank you! 🎉</h2>
          <h3 className="text-2xl font-bold">Your order has been received</h3>
        </div>

        {/* Product Images */}
        <div className="mb-8 flex justify-center gap-6">
          {orderDetails.items.map((item: any, index: any) => (
            <div key={index} className="relative">
              <Image
                src={item.imageUrl || '/placeholder.svg?height=80&width=80'}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900">
                <span className="text-xs text-white">{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Order code:</span>
            <span className="font-medium">{orderDetails.orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{new Date(orderDetails.date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total:</span>
            <span className="font-medium">{orderDetails.total + ' VND'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment method:</span>
            <span className="font-medium">{paymentMethodDisplay}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            variant="default"
            className="rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800"
            onClick={() => router.push('/purchase-history')}
          >
            Purchase history
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
