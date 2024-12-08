'use client';
import OrderForm from '@/components/Forms/OrderForm';
import CartContainer from '@/components/Navbar/CartContainer';
import { useCartStore } from '@/components/providers/CartProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';
import React, { useEffect, useState } from 'react';

const TransactionProcess = () => {
  const { items, calcTotalPrice } = useCartStore((state) => state);
  const [clientTotalPrice, setClientTotalPrice] = useState(BigInt(0));

  useEffect(() => {
    setClientTotalPrice(calcTotalPrice());
  }, [calcTotalPrice()]);

  return (
    <div className="mt-10 flex h-fit w-full flex-col gap-12 lg:mt-20 lg:flex-row">
      {/* Customer information */}
      <div className="order-2 w-full lg:order-1 lg:min-w-[643px]">
        <OrderForm />
      </div>
      {/* Cart Items detail */}
      <div className="order-1 w-full lg:order-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tổng kết giỏ hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {items && <CartContainer items={items} />}
            <div className="mx-4 mt-8 flex flex-col space-y-2">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p className="font-bold">{clientTotalPrice && ToVietnameseCurrency(clientTotalPrice)}</p>
              </div>
              <div className="flex justify-between text-[18px] font-bold">
                <p>Total:</p>
                <p>{clientTotalPrice && ToVietnameseCurrency(clientTotalPrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionProcess;
