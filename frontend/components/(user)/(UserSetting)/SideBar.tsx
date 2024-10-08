'use client';
import { useUserStore } from '@/components/providers/UserProvider';
import React from 'react';
import Image from 'next/image';
import { MYACCOUNT_SIDEBAR_ITEMS } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const path = usePathname();
  const { user } = useUserStore((state) => state);
  return (
    <div className="h-[288px] w-full bg-[var(--neutral-02)] lg:h-fit lg:min-h-[496px] lg:w-fit lg:min-w-[262px]">
      <div className="p-3">
        <div className="flex flex-col items-center space-y-2">
          {/* avatar */}
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white">
            <Image src={user?.avatarLink!} fill className="absolute object-cover" alt="User Avatar" />
            {/* <Image src={'/camera-icon.png'} width={30} height={30} className="absolute bottom-0 right-0" alt="icon" /> */}
          </div>
          <p className="font-semibold">Khoa Ly</p>
        </div>
        <div className="mt-8 hidden flex-col gap-3 lg:flex">
          {MYACCOUNT_SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`${path.includes(item.link) ? 'border-b-2 border-black text-black' : 'text-[var(--neutral-04)]'} flex h-[42px] font-semibold`}
            >
              <Link href={item.link}>{item.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
