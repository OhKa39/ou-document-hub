'use client';
import { useEffect, useState } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '../providers/UserProvider';
import { useRouter } from 'next/navigation';
import { getAuthCookies } from '@/actions/getAuthCookies';
// import CustomFetch from '@/utils/CustomFetch';
import Image from 'next/image';
import { UserState } from '@/store/UserStore';

const UserDropDown = ({ isAuthenticated, user }: UserState) => {
  const { logOut } = useUserStore((state) => state);
  const router = useRouter();

  return (
    <div className="hidden md:block">
      {!user || !isAuthenticated ? (
        <HiOutlineUserCircle
          size="28"
          data-testid="User"
          className="cursor-pointer"
          onClick={() => router.push('/sign-in')}
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white">
              {!user!.avatarLink ? (
                // <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white cursor-pointer">
                <p>{user!.firstName.charAt(0)}</p>
              ) : (
                <Image className="absolute h-full w-full" src={user!.avatarLink!} alt="UserAvatar" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[100] w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logOut()}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserDropDown;
