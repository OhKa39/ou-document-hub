import React from 'react';
import { VscLoading } from 'react-icons/vsc';

const NavbarButtonLoading = () => {
  return (
    <div className="flex justify-between space-x-4">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="hidden h-[30px] w-[30px] animate-pulse rounded-full bg-gray-200 lg:block"></div>
        ))}
      <VscLoading size={28} className="animate-spin lg:hidden" />
    </div>
  );
};

export default NavbarButtonLoading;
