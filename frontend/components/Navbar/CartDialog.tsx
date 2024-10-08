'use client';
import React, { useState } from 'react';
import { IoCartOutline, IoClose } from 'react-icons/io5';
import CartContainer from './CartContainer';
import { Button } from '../ui/button';
import Link from 'next/link';

const CartDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <IoCartOutline size="30" data-testid="Cart" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
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
              className="absolute right-4 top-4 cursor-pointer"
              aria-label="Close"
              onClick={() => setIsOpen(!isOpen)}
            />
            <CartContainer />
            <div className="mx-4 mt-8 flex flex-col space-y-2">
              <div className="flex justify-between">
                <p>Total:</p>
                <p className="font-bold">1515</p>
              </div>
              <div className="flex justify-between text-[18px] font-bold">
                <p>Subtotal:</p>
                <p>1515</p>
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
