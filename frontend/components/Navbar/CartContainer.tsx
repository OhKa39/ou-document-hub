import documents from '@/__mocks__/data/documents';
import React from 'react';
import CartItem from '../(user)/Cart/CartItem';

const CartContainer = () => {
  return (
    <div className="custom-scrollbar mx-4 mt-8 max-h-[300px] space-y-4 overflow-y-scroll">
      {documents.map((document) => (
        <CartItem document={document} isSmallSize={true} />
      ))}
    </div>
  );
};

export default CartContainer;
