'use client';

import { SELLER_SIDEBAR_ITEM } from '@/constants';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUserStore } from '../providers/UserProvider';

const SellerChannelSidebar = () => {
  const path = usePathname();
  const { user } = useUserStore((state) => state);
  const sellerId = user?.userId;

  return (
    <div className="min-w-[240px] border-r-[2px]">
      <p className="mx-auto mb-8 mt-5 flex cursor-default justify-center text-2xl font-extrabold">Kênh người bán</p>
      <div className="flex flex-col">
        {SELLER_SIDEBAR_ITEM.map((item, index) => {
          const isActive = path.includes(item.link);
          const isReport = item.id === 3;
          const dynamicLink = isReport ? `/sellers/${sellerId}` : item.link;

          return (
            <div
              key={index}
              className="relative flex h-[50px] w-full items-center justify-center text-[14px] font-medium text-black"
            >
              {path.includes(isReport ? `/sellers/${sellerId}` : item.link) && (
                <div className="absolute left-0 top-0 h-full w-[6px] rounded-md bg-[#0c4ca3]"></div>
              )}
              <Link
                href={dynamicLink}
                className={`${
                  path.includes(dynamicLink) ? 'rounded-md bg-[#0c4ca3] text-white' : ''
                } flex h-full w-[80%] items-center space-x-3`}
              >
                <Image
                  src={item.iconLink}
                  alt="Sidebar icon"
                  width={22}
                  height={22}
                  className={`ml-4 ${path.includes(dynamicLink) ? 'invert' : ''} aspect-auto`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerChannelSidebar;
