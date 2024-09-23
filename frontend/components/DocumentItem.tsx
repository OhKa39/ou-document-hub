'use client';
import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { IoHeartOutline } from 'react-icons/io5';
import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';
import DocumentType from '@/types/DocumentType';

type ComponentType = {
  resolutionMobile?: Array<number>;
  resolutionPC?: Array<number>;
};

type props = ComponentType & DocumentType;

const DocumentItem = ({ id, name, price, image, tag, resolutionMobile, resolutionPC }: props) => {
  const SCALE_MOBILE = resolutionMobile ?? [412, 231]; //hxw with default value
  const SCALE_PC = resolutionPC ?? [459, 262];

  return (
    <div className="container" data-testid="DocumentItem">
      <style jsx>{`
        * {
          padding: 0;
        }
        .container {
          height: ${SCALE_MOBILE[0]}px;
          width: ${SCALE_MOBILE[1]}px;
        }
        @media (min-width: 768px) {
          .container {
            height: ${SCALE_PC[0]}px;
            width: ${SCALE_PC[1]}px;
          }
        }
      `}</style>
      {/* header section */}
      <div className="group relative h-[75%] w-full bg-[#F3F5F7] md:h-[76%]">
        {/* tag and love button  */}
        <div className="absolute left-1/2 top-1 z-[99] flex w-[85%] -translate-x-1/2 items-center justify-between">
          <div className="w-[33%] bg-white text-center drop-shadow-md">
            {tag && (
              <p className="text-base font-bold" data-testid="Tag">
                {tag}
              </p>
            )}
          </div>
          <div className="flex h-8 w-8 cursor-pointer rounded-full bg-white text-center opacity-0 drop-shadow-md group-hover:opacity-100">
            <IoHeartOutline size={20} className="text-pink m-auto" data-testid="Love" />
          </div>
        </div>
        {/* document image */}
        <div
          className={`absolute left-1/2 top-1/2 h-[75%] -translate-x-1/2 -translate-y-[55%] shadow-xl md:h-[80%]`}
          style={{
            aspectRatio: image.width / image.height,
          }}
        >
          <Image
            src={image}
            alt="Document Image"
            fill
            // priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
            style={{ objectFit: 'contain' }}
            data-testid="DocumentImage"
          />
        </div>
        {/* add to cart button */}
        <Button
          className="absolute bottom-2 left-1/2 hidden w-[88%] -translate-x-1/2 group-hover:block md:w-[84%]"
          data-testid="AddToCart"
          aria-label="Add To Cart"
        >
          Thêm vào giỏ
        </Button>
      </div>
      {/* document detail section */}
      <div className="h-[30%] shadow-sm">
        <Rating
          initialValue={5}
          readonly={true}
          size={20}
          SVGstyle={{ display: 'inline' }}
          fillColor="#FFAB08"
          data-testid="Stars"
        />
        <p
          className="overflow-hidden text-ellipsis text-base font-semibold md:text-[18px] lg:w-[80%]"
          data-testid="DocumentName"
        >
          <Link href="#">{name}</Link>
        </p>
        <p className="text-sm font-semibold text-[#B30000] md:text-base" data-testid="DocumentPrice">
          {price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
        </p>
      </div>
    </div>
  );
};

export default DocumentItem;
