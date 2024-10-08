'use client';
import { ADMIN_NAV_ITEMS } from '@/constants';
import React, { useContext } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GlobalAdminContext } from '../providers/GlobalAdminProvider';

const AdminSidebar = () => {
  const { isOpen } = useContext(GlobalAdminContext);
  const path = usePathname();
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} fixed h-screen min-w-[240px]`}>
      <h1 className="mx-auto mb-8 mt-5 flex cursor-default justify-center text-2xl font-extrabold">
        <span className="text-[#0c4ca3]">Admin</span>Panel
      </h1>
      <div className="flex flex-col">
        {ADMIN_NAV_ITEMS.map((item) => (
          <div className="relative flex h-[50px] w-full items-center justify-center text-[14px] font-medium text-black">
            {path.includes(item.link) && (
              <div className="absolute left-0 top-0 h-full w-[6px] rounded-md bg-[#0c4ca3]"></div>
            )}
            <div
              className={`${path.includes(item.link) ? 'rounded-md bg-[#0c4ca3] text-white' : ''} flex h-full w-[80%] items-center space-x-3`}
            >
              <Image
                src={item.iconLink}
                alt="Sidebar icon"
                width={22}
                height={22}
                className={`ml-4 ${path.includes(item.link) ? 'invert' : ''}`}
              />
              <Link href={item.link}>{item.name}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
