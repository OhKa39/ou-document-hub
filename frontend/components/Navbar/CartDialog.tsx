'use client';
import React, { useEffect, useState } from 'react';
import { IoCartOutline, IoClose } from 'react-icons/io5';
import CartContainer from './CartContainer';
import { Button } from '../ui/button';
import Link from 'next/link';
import useGetCart from '@/hooks/useGetCart';
import CartItemType from '@/types/CartItemType';
import { useCartStore } from '../providers/CartProvider';
import { useUserStore } from '../providers/UserProvider';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';

const CartDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useGetCart();
  const { items, calcTotalPrice, syncItems, postItem } = useCartStore((state) => state);
  const { isAuthenticated } = useUserStore((state) => state);

  console.log(calcTotalPrice());

  useEffect(() => {
    if (data) {
      const dataCart: CartItemType[] = data.data.cartItems.map((item: any) => {
        return { documentId: item.document.documentId, price: item.document.price, quantity: item.quantity };
      });
      syncItems(dataCart);
      postItem(isAuthenticated);
    }
  }, [data]);

  return (
    <div>
      <div className="relative">
        <IoCartOutline size="30" data-testid="Cart" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
        <div
          className="absolute -right-2 -top-1 h-5 w-5 cursor-pointer rounded-full bg-[var(--neutral-07)] text-center text-sm text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {items.length >= 10 ? '!' : items.length}
        </div>
      </div>
      {isOpen && (
        <div className="fixed -left-2 top-0 z-[998] h-screen w-screen bg-black/70">
          <div
            className={`z-[999] ${isOpen ? 'flex' : 'hidden'} fixed right-0 top-0 h-screen w-[80%] flex-col overflow-hidden bg-[var(--neutral-01)] sm:overflow-y-auto lg:w-[30%]`}
          >
            {/* CloseButton */}
            <div className="ml-4 mt-4 text-3xl font-bold">Giỏ hàng</div>
            <IoClose
              size="36"
              data-testid="MenuClose"
              className="absolute right-3 top-4 cursor-pointer"
              aria-label="Close"
              onClick={() => setIsOpen(!isOpen)}
            />
            {!isLoading && <CartContainer items={items} />}
            {/* {isError && <p>Error</p>} */}
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
            <Button className="mx-4 mt-2">Checkout</Button>
            <Link className="mx-auto mt-2 font-semibold underline" href="/cart/process-step-1">
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDialog;
