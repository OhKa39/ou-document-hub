'use client';
import OrderContactForm from '@/components/Forms/OrderContactForm';
import CartContainer from '@/components/Navbar/CartContainer';
import { useCartStore } from '@/components/providers/CartProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';
import React from 'react';

const TransactionProcess = () => {
  const { items, calcTotalPrice } = useCartStore((state) => state);
  console.log(process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID);
  return (
    <div className="mt-10 flex h-fit w-full flex-col gap-12 lg:mt-20 lg:flex-row">
      {/* Customer information */}
      <div className="order-2 w-full lg:order-1 lg:min-w-[643px]">
        <OrderContactForm />
      </div>
      {/* Cart Items detail */}
      <div className="order-1 w-full lg:order-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            {items && <CartContainer items={items} />}
            <div className="mx-4 mt-8 flex flex-col space-y-2">
              <div className="flex justify-between">
                <p>Total:</p>
                <p className="font-bold">{ToVietnameseCurrency(calcTotalPrice())}</p>
              </div>
              <div className="flex justify-between text-[18px] font-bold">
                <p>Subtotal:</p>
                <p>{ToVietnameseCurrency(calcTotalPrice())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionProcess;
