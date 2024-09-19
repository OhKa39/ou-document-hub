'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { IoClose, IoHeartOutline, IoMailOutline, IoMenuOutline } from 'react-icons/io5';
import { AiOutlineMessage } from 'react-icons/ai';
import { Button } from '@/components/ui/button';

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
    name: 'Thống Kê',
  },
];

type subMenuItemType = {
  id: number;
  link: string;
  name: string;
  icon: IconType;
};

const subMenuItems: subMenuItemType[] = [
  {
    id: 1,
    link: '#',
    name: 'Hòm thư phản hồi',
    icon: IoMailOutline,
  },
  {
    id: 2,
    link: '#',
    name: 'Tin nhắn',
    icon: AiOutlineMessage,
  },
  {
    id: 3,
    link: '#',
    name: 'Tài liệu yêu thích',
    icon: IoHeartOutline,
  },
];

const ResponsiveMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IoMenuOutline
        size="28"
        data-testid="MenuOpen"
        className={`cursor-pointer md:hidden`}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="fixed -left-2 top-0 z-[998] h-screen w-screen backdrop-blur-md backdrop-brightness-75 backdrop-filter md:hidden">
          <div
            className={`z-[999] ${isOpen ? 'flex' : 'hidden'} fixed left-0 top-0 h-screen w-[90%] flex-col overflow-hidden bg-[var(--neutral-01)] sm:overflow-y-auto md:hidden`}
          >
            {/* CloseButton */}
            <IoClose
              size="36"
              data-testid="MenuClose"
              className="absolute right-4 top-4 cursor-pointer"
              aria-label="Close"
              onClick={() => setIsOpen(!isOpen)}
            />
            {/* Main navagition button */}
            <div className="mx-4">
              {/* Title */}
              <h1 className="mt-[16px] text-[24px] font-bold text-[#0c4ca3]">OUDocumentHub</h1>
              {/* Section 1 */}
              <ul className="mt-4 flex min-h-[200px] flex-col gap-4">
                {menuItems.map((item: menuItemType, index: number) => (
                  <li
                    data-testid="MenuResponsiveItem"
                    key={item.id}
                    className="text-base font-semibold text-primary duration-300"
                  >
                    <Link href={`${item.link}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
              {/* Section 2 */}
              <div className="mt-16 flex flex-col justify-center">
                {subMenuItems.map((item, index) => (
                  <Link key={index} href={item.link} className="py-auto flex h-[40px] items-center justify-between">
                    <h3 className="text-base" data-testid="SubmenuItem">
                      {item.name}
                    </h3>
                    <div className="flex shrink-0 justify-center gap-1">
                      {<item.icon className="h-[24px] w-[24px]" />}
                      <div className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full bg-black text-[12px] text-white">
                        <p>2</p>
                      </div>
                    </div>
                  </Link>
                ))}
                <Button className="mx-auto h-[52px] w-[295px] bg-black" data-testid="LoginButton" aria-label="Login">
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsiveMenu;
