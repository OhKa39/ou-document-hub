import React from 'react';
import CartItem from '../(user)/Cart/CartItem';
import CartItemType from '@/types/CartItemType';
import { ShoppingCart } from 'lucide-react';
type props = {
  items: CartItemType[];
};

const CartContainer = ({ items }: props) => {
  // console.log(cartItems)
  return (
    <div className="custom-scrollbar mx-4 mt-8 max-h-[600px] min-h-[300px] space-y-4 overflow-y-scroll">
      {items.map((cartItem: CartItemType) => (
        <CartItem key={cartItem.documentId} cartItem={cartItem} isSmallSize={true} />
      ))}
      {items.length === 0 && (
        <div className="flex flex-grow items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-gray-100 p-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-600">Your cart is empty</p>
            <p className="text-sm text-gray-500">Add items to your cart to see them here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartContainer;
