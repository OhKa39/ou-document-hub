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

const menuItems = [
  {
    id: 1,
    link: '#',
    name: 'Kho Tài Liệu',
  },
  {
    id: 2,
    link: '#',
    name: 'Kênh Người Bán',
  },
  {
    id: 3,
    link: '#',
    name: 'Tìm Kiếm',
  },
  {
    id: 4,
    link: '#',
    name: 'Thông Tin Cá Nhân',
  },
  {
    id: 5,
    link: '#',
    name: 'Tin Nhắn',
  },
  {
    id: 6,
    link: '#',
    name: 'Hòm Thư Phản Hồi',
  },
  {
    id: 7,
    link: '#',
    name: 'Thống Kê',
  },
];

const ResponsiveMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <IoMenuOutline
        size="28"
        data-testid="MenuResponsive"
        className="cursor-pointer md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      />
      <div
        className={`z-[999] ${isOpen ? 'flex' : 'hidden'} bg-[var(--neutral-01)]/50 left-0 top-0 h-screen w-screen flex-col overflow-hidden fixed backdrop-blur-lg md:hidden`}
      >
        <IoClose
          size="36"
          data-testid="MenuClose"
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <ul className="flex h-full flex-col items-center justify-center gap-8">
          {menuItems.map((item: menuItemType, index: number) => (
            <li
              data-testid="MenuResponsiveItem"
              key={item.id}
              className="text-primary hover:text-secondary-blue text-3xl transition-colors duration-300 font-semibold"
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
