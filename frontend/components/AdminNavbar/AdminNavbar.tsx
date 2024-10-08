'use client';
import React, { useContext } from 'react';
import { IoMenuOutline } from 'react-icons/io5';
import { GlobalAdminContext } from '../providers/GlobalAdminProvider';
import { Input } from '../ui/input';

const AdminNavbar = () => {
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
          <Input className="absolute left-0 top-0 w-full rounded-3xl bg-[#F5F6FA] stroke-[#D5D5D5]" />
        </div>
      </div>
      <div className="mr-8 flex h-full items-center space-x-4"></div>
    </div>
  );
};

export default AdminNavbar;
