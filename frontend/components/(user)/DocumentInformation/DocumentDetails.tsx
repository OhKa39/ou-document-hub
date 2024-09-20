'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Rating } from 'react-simple-star-rating';

const DocumentDetails = () => {
  return (
    <div className="flex h-fit flex-col lg:flex-row lg:gap-16">
      {/* image section */}
      <div className="flex w-full flex-col gap-4 lg:min-w-[542px]">
        {/* main image */}
        <div className="relative h-[729px] bg-[#F3F5F7]"></div>
        {/* image list */}
        <div className="hidden gap-4 lg:flex"></div>
      </div>
      {/* details section */}
      <div className="flex w-full flex-col">
        {/* header */}
        <div className="flex flex-col gap-4">
          {/* star section */}
          <div className="flex items-end gap-4">
            <Rating
              initialValue={5}
              readonly={true}
              size={28}
              SVGstyle={{ display: 'inline' }}
              fillColor="#FFAB08"
              data-testid="Stars"
            />
            <p className="text-xl text-[var(--neutral-07)]">11 người đánh giá</p>
          </div>
          <h1 className="text-5xl font-bold">Tray Table</h1>
          <p className="text-xl text-[var(--neutral-04)]">
            Buy one or buy a few and make every space where you sit more convenient. Light and easy to move around with
            removable tray top, handy for serving snacks.
          </p>
          <h1 className="text-2xl font-semibold text-[#B30000]" data-testid="DocumentPrice">
            {Number(1110000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
          </h1>
        </div>
        <Button>Thêm vào giỏ hàng</Button>
      </div>
    </div>
  );
};

export default DocumentDetails;
