import React from 'react';
import Image from 'next/image';
import BookStore from '@/public/ModernLibrary.webp';

const CarouselImageSection = () => {
  return (
    <div className="h-[392px] w-full">
      <div className="relative h-full w-full">
        {/* image section */}
        <Image
          src={BookStore}
          alt="ImageCarousel"
          className="absolute w-full"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        {/* text section */}
        <div className="absolute flex h-full w-full flex-col items-center justify-center gap-8 font-semibold">
          <div className="flex gap-2">
            <p className="text-slate-700">Trang chủ {` >`}</p>
            <p>Kho tài liệu</p>
          </div>
          <h1 className="text-4xl lg:text-5xl">Document Page</h1>
          <p className="text-base !font-normal lg:text-2xl">Let’s design the place you always imagined.</p>
        </div>
      </div>
    </div>
  );
};

export default CarouselImageSection;
