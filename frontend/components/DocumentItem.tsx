'use client';
import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import Book1 from '@/public/Book1.jpg';
import { IoHeartOutline } from 'react-icons/io5';
import { Rating } from 'react-simple-star-rating';

const DocumentItem = () => {
  return (
    <div className="h-[412px] w-[231px] lg:h-[459px] lg:w-[262px]">
      {/* img section */}
      <div className="group relative h-[308px] w-full bg-[#F3F5F7] lg:h-[349px]">
        {/* tag and love button  */}
        <div className="absolute left-1/2 top-1 z-[99] flex w-[85%] -translate-x-1/2 items-center justify-between">
          <div className="w-[67px] bg-white text-center drop-shadow-lg">
            <h1 className="text-base font-bold" data-testid="Tag">
              New
            </h1>
          </div>
          <div className="flex h-8 w-8 cursor-pointer rounded-full bg-white text-center opacity-0 drop-shadow-lg group-hover:opacity-100">
            <IoHeartOutline size={20} className="text-pink m-auto" data-testid="Love" />
          </div>
        </div>
        {/* document image */}
        <Image
          src={Book1}
          alt="Document Image"
          className="absolute left-1/2 top-1/2 h-[260px] w-[180px] -translate-x-1/2 -translate-y-[55%] lg:h-[300px] lg:w-[210px]"
          data-testid="DocumentImage"
        />
        {/* add to cart button */}
        <Button
          className="absolute bottom-2 left-1/2 hidden w-[203px] -translate-x-1/2 bg-black group-hover:block lg:w-[220px]"
          data-testid="AddToCart"
        >
          Thêm vào giỏ
        </Button>
      </div>
      {/* document detail section */}
      <div className="ml-2 h-[98px]">
        <Rating
          initialValue={5}
          readonly={true}
          size={20}
          SVGstyle={{ display: 'inline'}}
          fillColor="--var(neutral-05)"
          data-testid="Stars"
        />
        <h1 className="text-base font-semibold lg:text-[18px]" data-testid="DocumentName">
          Giáo trình pháp luật đại cương
        </h1>
        <h1 className="text-sm font-semibold lg:text-base" data-testid="DocumentPrice">
          299.000đ
        </h1>
      </div>
    </div>
  );
};

export default DocumentItem;
