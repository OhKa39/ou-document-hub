'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import MinusButton from './MinusButton';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';
import CartItemType from '@/types/CartItemType';
import { useCartStore } from '@/components/providers/CartProvider';
import useGetDocumentById from '@/hooks/useGetDocumentById';
import CartItemLoading from '@/components/Loading/CartItemLoading';
import { useUserStore } from '@/components/providers/UserProvider';

type props = {
  cartItem: CartItemType;
  isSmallSize?: boolean;
};

const CartItem = ({ cartItem, isSmallSize = false }: props) => {
  const { data, isLoading, isError } = useGetDocumentById(cartItem.documentId);
  // console.log(data);
  const document = data?.data;
  const { deleteItem, postItem } = useCartStore((state) => state);
  const { isAuthenticated } = useUserStore((state) => state);
  const [value, setValue] = useState(cartItem.quantity);

  const handleDelete = (data: CartItemType) => {
    deleteItem(data);
    postItem(isAuthenticated);
  };

  if (isLoading) return <CartItemLoading isSmallSize={isSmallSize} />;

  return (
    <>
      <div key={cartItem.itemId} className="flex w-full gap-4">
        {/* image section */}
        <div className="relative h-[104px] min-w-[88px] bg-[#F3F5F7]">
          <Image
            fill
            src={document!.thumbnailUrl}
            className="absolute top-2 h-[75%] w-[75%]"
            style={{ objectFit: 'contain' }}
            alt="Image Document"
          />
        </div>
        <div className="flex w-full flex-col gap-3 text-base">
          <div className="flex max-w-full items-center justify-between">
            <p className="max-w-[130px] overflow-hidden truncate font-semibold text-black lg:max-w-[180px]">
              {document.name}
            </p>
            <IoCloseSharp
              onClick={() => handleDelete({ ...cartItem, price: document.price })}
              size={28}
              className={`${isSmallSize ? 'lg:block' : 'lg:hidden'} cursor-pointer`}
            />
          </div>
          <div className="flex w-[98%] items-center justify-between">
            <p className="text-xs lg:text-base">Số lượng: {document!.stock}</p>
            <p className={`text-left text-xs text-black lg:text-base ${isSmallSize ? 'lg:block' : 'lg:hidden'}`}>
              {ToVietnameseCurrency(document.price)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 lg:justify-normal lg:text-[var(--neutral-04)]">
            <div className={`${isSmallSize ? 'text-black lg:block' : 'lg:hidden'} h-[32px] w-[84px]`}>
              <MinusButton
                setValue={setValue}
                price={document.price}
                documentId={document.documentId}
                value={value}
                isInputDisable={true}
              />
            </div>
            <IoCloseSharp
              onClick={() => handleDelete(cartItem)}
              size={20}
              className={`${isSmallSize ? 'hidden' : 'hidden lg:block'} cursor-pointer`}
            />
            <p className={`hidden cursor-pointer font-semibold ${isSmallSize ? 'lg:hidden' : 'lg:block'}`}>Xóa</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
