'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { IoNotificationsOutline, IoSearchOutline, IoCartOutline } from 'react-icons/io5';
import ResponsiveMenu from './ResponsiveMenu';
import { usePathname, useRouter } from 'next/navigation';
import UserDropDown from './UserDropDown';
import { useUserStore } from '../providers/UserProvider';
import { useQuery } from '@tanstack/react-query';
import { VscLoading } from 'react-icons/vsc';
import ServerFetch from '@/utils/ServerFetch';
import HeaderItemType from '@/types/HeaderItemType';
import { NAVBAR_ITEMS } from '@/constants';
import NavbarButtonLoading from '../Loading/NavbarButtonLoading';
import CartDialog from './CartDialog';
import { GET_USER_ENDPOINT } from '@/constants/api_endpoint';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import dynamic from 'next/dynamic';
import { SearchDialog } from './SearchDialog';

// const CartDialog = dynamic(() => import('./CartDialog'));

const Navbar = () => {
  const { data, isLoading, isError, error } = useGetCurrentUser();
  console.log('isLOading' + isLoading);
  console.log('isError' + isLoading);

  return (
    <nav className="relative z-[999] flex h-[4rem] max-w-[1536px] items-center justify-between px-8 py-4 shadow-lg md:px-8 lg:px-32 2xl:mx-auto">
      {/*Logo*/}
      <div className="flex items-center justify-center space-x-2 lg:space-x-0">
        <ResponsiveMenu />
        <h1 className="font-Poppins cursor-pointer text-xl font-bold text-[#0c4ca3] lg:text-2xl">
          <Link href="/">OUDocumentHub</Link>
        </h1>
      </div>

      {/*Menu Items*/}
      <ul className="hidden justify-between space-x-6 lg:flex">
        {NAVBAR_ITEMS.map((ele: HeaderItemType, index) => (
          <li
            key={index}
            data-testid="MenuItemDesktop"
            className="font-Space_Grotesk text-neutral-07 inline-block cursor-pointer font-semibold transition-colors duration-500 hover:text-[#0c8ca3]"
          >
            <Link href={`${ele.link}`}>{ele.name}</Link>
          </li>
        ))}
      </ul>
      {isLoading ? (
        <NavbarButtonLoading />
      ) : (
        <div className="flex justify-between space-x-4">
          <SearchDialog />
          <IoNotificationsOutline size="30" data-testid="Notification" className="cursor-pointer" />
          <UserDropDown data={data} isError={isError} error={error} />
          <CartDialog />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
