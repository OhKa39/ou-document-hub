'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IoClose, IoMenuOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import HeaderItemType from '@/types/HeaderItemType';
import { MENU_ITEMS, SUB_MENU_ITEMS } from '@/constants';

const ResponsiveMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IoMenuOutline
        size="28"
        data-testid="MenuOpen"
        className={`cursor-pointer lg:hidden`}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="fixed -left-2 top-0 z-[998] h-screen w-screen backdrop-blur-md backdrop-brightness-75 backdrop-filter lg:hidden">
          <div
            className={`z-[999] ${isOpen ? 'flex' : 'hidden'} fixed left-0 top-0 h-screen w-[90%] flex-col overflow-hidden bg-[var(--neutral-01)] sm:overflow-y-auto lg:hidden`}
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
                {MENU_ITEMS.map((item: HeaderItemType, index) => (
                  <li
                    data-testid="MenuResponsiveItem"
                    key={index}
                    className="text-base font-semibold text-primary duration-300"
                  >
                    <Link href={`${item.link}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
              {/* Section 2 */}
              <div className="mt-16 flex flex-col justify-center">
                {SUB_MENU_ITEMS.map((item, index) => (
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
