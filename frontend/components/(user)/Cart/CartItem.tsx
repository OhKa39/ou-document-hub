import React from 'react';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import MinusButton from './MinusButton';
import DocumentType from '@/types/DocumentType';

type props = {
  document: DocumentType;
  isSmallSize?: boolean;
};

const CartItem = ({ document, isSmallSize = false }: props) => {
  return (
    <div key={document.id} className="flex w-full gap-4">
      {/* image section */}
      <div className="relative h-[104px] min-w-[88px] bg-[#F3F5F7]">
        <Image
          fill
          src={document.image}
          className="absolute top-2 h-[75%] w-[75%]"
          style={{ objectFit: 'contain' }}
          alt="Image Document"
        />
      </div>
      <div className="flex w-full flex-col gap-3 text-base">
        <div className="flex max-w-full items-center justify-between">
          <p className="max-w-[180px] overflow-hidden truncate font-semibold text-black">
            {document.name} reqwrqwereqwrqwerqwer
          </p>
          <IoCloseSharp size={28} className={`${isSmallSize ? 'lg:block' : 'lg:hidden'}`} />
        </div>
        <div className="flex w-[98%] items-center justify-between">
          <p>Số lượng: 9</p>
          <p className={`text-left text-xl text-black ${isSmallSize ? 'lg:block' : 'lg:hidden'}`}>12321</p>
        </div>
        <div className="flex items-center justify-between gap-2 lg:justify-normal lg:text-[var(--neutral-04)]">
          <div className={`${isSmallSize ? 'text-black lg:block' : 'lg:hidden'} h-[32px] w-[84px]`}>
            <MinusButton />
          </div>
          <IoCloseSharp size={20} className={`${isSmallSize ? 'hidden' : 'hidden lg:block'}`} />
          <p className={`hidden cursor-pointer font-semibold ${isSmallSize ? 'lg:hidden' : 'lg:block'}`}>Xóa</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
