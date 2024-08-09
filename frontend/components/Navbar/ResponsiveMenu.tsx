'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoMenuOutline } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';

type menuItemType = {
  id: number;
  link: string;
  name: string;
};

const ResponsiveMenu = () => {
  const [isOpen, setOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      link: '#',
      name: 'Kho tài liệu',
    },
    {
      id: 2,
      link: '#',
      name: 'Kênh người bán',
    },
    {
      id: 3,
      link: '#',
      name: 'Tìm kiếm',
    },
    {
      id: 4,
      link: '#',
      name: 'Thông tin cá nhân',
    },
    {
      id: 5,
      link: '#',
      name: 'Tin nhắn',
    },
    {
      id: 6,
      link: '#',
      name: 'Hòm thư phản hồi',
    },
    {
      id: 7,
      link: '#',
      name: 'Thông kê',
    },
  ];

  return (
    <div>
      <IoMenuOutline
        size="28"
        data-testid="MenuResponsive"
        className="cursor-pointer md:hidden"
        onClick={() => setOpen(!isOpen)}
      />
      <div
        className={`z-[999] ${isOpen ? 'flex' : 'hidden'} bg-neutral-01/50 absolute left-0 top-0 h-screen w-screen flex-col overflow-hidden backdrop-blur-sm md:hidden`}
      >
        <IoClose
          size="28"
          data-testid="MenuClose"
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => setOpen(!isOpen)}
        />
        <ul className="flex h-full flex-col items-center justify-center gap-4">
          {menuItems.map((item: menuItemType, index: number) => (
            <li
              data-testid="MenuResponsiveItem"
              key={item.id}
              className="text-primary hover:text-secondary-blue text-2xl transition-colors duration-300 font-semibold"
            >
              <Link href={`${item.link}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
