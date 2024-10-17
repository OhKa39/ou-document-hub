'use client';
import React, { useContext, useEffect } from 'react';
import { IoMenuOutline } from 'react-icons/io5';
import { GlobalAdminContext } from '../providers/GlobalAdminProvider';
import { Input } from '../ui/input';
import { useUserStore } from '../providers/UserProvider';
import Image from 'next/image';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';

const AdminNavbar = () => {
  const { user, isAuthenticated, setUser, logOut } = useUserStore((state) => state);
  const { data, isLoading, isError } = useGetCurrentUser();

  useEffect(() => {
    // console.log(data);
    if (data) setUser(data.data);
    if (isError) logOut;
  }, [data, setUser]);

  const { isOpen, setIsOpen } = useContext(GlobalAdminContext);
  return (
    <div className="flex h-[70px] items-center justify-between">
      <div className="flex h-full items-center space-x-8 pl-8">
        <IoMenuOutline
          size="28"
          data-testid="MenuOpen"
          className={`cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className="relative hidden h-[38px] w-[388px] lg:block">
          <Image
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width={15}
            height={15}
            src={'/search.svg'}
            alt="search icon"
          />
          <Input className="w-full rounded-3xl bg-[#F5F6FA] stroke-[#D5D5D5] pl-9 text-[14px]" placeholder="Tìm kiếm" />
        </div>
      </div>
      <div className="mr-8 flex h-full items-center space-x-6">
        <div className="relative h-[32px] w-[28px]">
          <Image src={'/icon1.svg'} alt="Notification bell" fill className="absolute object-contain" />
        </div>
        <div className="flex w-[169px] items-center space-x-4">
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image src={user?.avatarLink!} alt="user avatar" fill className="absolute object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-bold text-[#404040]">{user?.lastName + ' ' + user?.firstName}</p>
            <p className="text-[12px] font-semibold text-[#565656]">
              {user?.roles.includes('ROLE_GODADMIN') ? 'GOD ADMIN' : 'ADMIN'}
            </p>
          </div>
          <div className="relative h-5 w-5 overflow-hidden rounded-full">
            <Image src={'/More.svg'} alt="more button" fill className="absolute object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
