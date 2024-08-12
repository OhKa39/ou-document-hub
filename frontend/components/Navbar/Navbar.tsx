import Link from 'next/link';
import React from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';
import { IoCartOutline } from 'react-icons/io5';
import ResponsiveMenu from './ResponsiveMenu';

type menuElementType = {
  id: number;
  name: string;
  link: string;
};

const menuElement: menuElementType[] = [
  {
    id: 1,
    name: 'Trang Chủ',
    link: '/',
  },
  {
    id: 2,
    name: 'Kho Tài Liệu',
    link: '/documents',
  },
  {
    id: 3,
    name: 'Kênh Người Bán',
    link: '/seller-channel',
  },

];

const Navbar = () => {

  return (
    <nav className="md:px-8 align-center relative z-[999] flex h-[3.75rem] justify-between px-12 py-4 lg:px-32 shadow-lg">
      {/*Logo*/}
      <div className="align-center flex justify-center space-x-2">
        <ResponsiveMenu />
        <h1 className="cursor-pointer font-Poppins text-xl font-bold text-[#0c4ca3]">
          <Link href="/">OUDocumentHub</Link>
        </h1>
      </div>

      {/*Menu Items*/}
      <ul className="align-center hidden justify-between space-x-6 py-1 md:flex">
        {menuElement.map((ele: menuElementType, idx: number) => (
          <li
            key={ele.id}
            data-testid='MenuItemDesktop'
            className="inline-block cursor-pointer font-Space_Grotesk font-semibold text-neutral-07 transition-colors duration-500 hover:border-b-2 hover:pb-5 hover:border-[#0c8ca3] hover:text-[#0c8ca3]"
          >
            <Link href={`${ele.link}`}>{ele.name}</Link>
          </li>
        ))}
      </ul>
      {/*Button Items*/}
      <div className="align-center flex justify-between space-x-4">
        <IoSearchOutline size="28" data-testid="Search" className="button-navbar hidden cursor-pointer md:block" />
        <IoNotificationsOutline size="28" data-testid="Notification" className="cursor-pointer" />
        <HiOutlineUserCircle size="28" data-testid="User" className="hidden cursor-pointer md:block" />
        <IoCartOutline size="28" data-testid="Cart" className="cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
