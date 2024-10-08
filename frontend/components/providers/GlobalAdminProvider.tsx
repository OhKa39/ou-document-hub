'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import AdminSidebar from '../AdminSidebar.tsx/AdminSidebar';
interface MyContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const GlobalAdminContext = createContext<MyContextType>({ isOpen: true, setIsOpen: () => {} });

const GlobalAdminProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <GlobalAdminContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex">
        <AdminSidebar />
        <div className={`${isOpen ? 'ml-[240px]' : ''} flex-1`}>
          <AdminNavbar />
          {children}
        </div>
      </div>
    </GlobalAdminContext.Provider>
  );
};

export default GlobalAdminProvider;
