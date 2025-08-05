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
  console.log('Sidebar user:', user); // Debug log

  return (
    <div className="h-[288px] w-full bg-[var(--neutral-02)] lg:h-fit lg:min-h-[496px] lg:w-fit lg:min-w-[262px]">
      <div className="p-3">
        <div className="flex flex-col items-center space-y-2">
          {/* avatar */}
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white">
            {user?.avatarLink && (
              <Image
                src={user?.avatarLink ? `${user.avatarLink}?v=${Date.now()}` : '/default-avatar.png'}
                fill
                className="absolute object-cover"
                alt="User Avatar"
                key={user?.avatarLink || 'default'} // Force re-render on avatarLink change
              />
            )}
          </div>
          <p className="font-semibold">{user?.lastName! + ' ' + user?.firstName!}</p>
        </div>
        <div className="mt-8 hidden flex-col gap-3 lg:flex">
          {MYACCOUNT_SIDEBAR_ITEMS.map((item, index) => (
            <div
              key={index}
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
