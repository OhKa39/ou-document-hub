import React from 'react';
type props = {
  isSmallSize: boolean;
};

const CartItemLoading = ({ isSmallSize }: props) => {
  return (
    <div className="flex w-full gap-4">
      {/* image section */}
      <div className="relative h-[104px] min-w-[88px] animate-pulse bg-gray-200" />
      <div className="flex w-full flex-col gap-3 text-base">
        <div className="flex max-w-full items-center justify-between">
          <div className="h-[20px] min-w-[180px] animate-pulse overflow-hidden truncate bg-gray-200 font-semibold text-black" />
          <div className={`${isSmallSize ? 'lg:block' : 'lg:hidden'} h-7 w-7 animate-pulse rounded-full bg-gray-200`} />
        </div>
        <div className="flex h-[20px] w-full items-center justify-between">
          <div className="h-full min-w-[140px] animate-pulse bg-gray-200" />
          <div
            className={`h-full min-w-[60px] text-left text-base text-black ${isSmallSize ? 'lg:block' : 'lg:hidden'} animate-pulse bg-gray-200`}
          />
        </div>
        <div className="flex items-center justify-between lg:justify-normal lg:text-[var(--neutral-04)]">
          <div
            className={`${isSmallSize ? 'text-black lg:block' : 'lg:hidden'} h-[32px] w-[84px] animate-pulse bg-gray-200`}
          >
            <div />
          </div>
          <div className={`${isSmallSize ? 'hidden' : 'hidden lg:block'} cursor-pointer`} />
          <div
            className={`hidden min-h-[32px] min-w-[64px] animate-pulse bg-gray-200 font-semibold ${isSmallSize ? 'lg:hidden' : 'lg:block'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItemLoading;
