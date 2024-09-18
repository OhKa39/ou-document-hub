'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { IoNotificationsOutline, IoSearchOutline, IoCartOutline } from 'react-icons/io5';
import ResponsiveMenu from './ResponsiveMenu';
import { useRouter } from 'next/navigation';
import UserDropDown from './UserDropDown';
import { useUserStore } from '../providers/UserProvider';
import { useQuery } from '@tanstack/react-query';
import { VscLoading } from 'react-icons/vsc';
import ServerFetch from '@/utils/ServerFetch';

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

const fetchUser = async () => {
  const userResponse = await ServerFetch(`/api/v1/user`);
  // console.log(userResponse);
  if (!userResponse.ok) {
    throw new Error('Network response was not ok');
  }
  return userResponse.json();
};

const Navbar = () => {
  const router = useRouter();

  const { user, isAuthenticated, setUser, logOut } = useUserStore((state) => state);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: 1,
    refetchInterval: 1000 * 60 * 10,
  });

  useEffect(() => {
    // console.log(data);
    if (data) setUser(data.data);
    if (isError) logOut;
  }, [data, setUser]);

  return (
    <nav className="relative z-[999] flex h-[3.75rem] max-w-[1536px] justify-between px-12 py-4 shadow-lg md:px-8 lg:px-32 2xl:mx-auto">
      {/*Logo*/}
      <div className="flex justify-center space-x-2">
        <ResponsiveMenu />
        <h1 className="font-Poppins cursor-pointer text-xl font-bold text-[#0c4ca3]">
          <Link href="/">OUDocumentHub</Link>
        </h1>
      </div>

      {/*Menu Items*/}
      <ul className="hidden justify-between space-x-6 py-1 md:flex">
        {menuElement.map((ele: menuElementType, idx: number) => (
          <li
            key={ele.id}
            data-testid="MenuItemDesktop"
            className="font-Space_Grotesk text-neutral-07 inline-block cursor-pointer font-semibold transition-colors duration-500 hover:border-b-2 hover:border-[#0c8ca3] hover:pb-5 hover:text-[#0c8ca3]"
          >
            <Link href={`${ele.link}`}>{ele.name}</Link>
          </li>
        ))}
      </ul>
      {/*Button Items*/}
      {isLoading ? (
        <VscLoading size={28} className="animate-spin" />
      ) : (
        <div className="flex justify-between space-x-4">
          <IoSearchOutline size="28" data-testid="Search" className="button-navbar hidden cursor-pointer md:block" />
          <IoNotificationsOutline size="28" data-testid="Notification" className="cursor-pointer" />
          <UserDropDown user={user} isAuthenticated={isAuthenticated} />
          <IoCartOutline size="28" data-testid="Cart" className="cursor-pointer" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
