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
import Link from 'next/link';
import { useCartStore } from '../providers/CartProvider';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';

const UserDropDown = () => { 
  const { user, isAuthenticated, setUser, logOut } = useUserStore((state) => state);
  const { data, isLoading, isError } = useGetCurrentUser();
  const {resetCart} = useCartStore(state=>state);
  const router = useRouter();

  useEffect(() => {
    console.log(data);
    if (data) setUser(data.data);
    if (isError) {
      logOut();
    }
  }, [data, setUser, isError]);

  const handleLogout = () => {
    logOut();
    resetCart();
  }

  return (
    <div className="hidden lg:block">
      {!user || !isAuthenticated ? (
        <HiOutlineUserCircle
          size="30"
          data-testid="User"
          className="cursor-pointer"
          onClick={() => router.push('/sign-in')}
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative flex h-[30px] w-[30px] cursor-pointer items-center justify-center overflow-hidden rounded-full text-white">
              <Image
                className="absolute left-0 top-0 object-cover"
                src={user!.avatarLink!}
                alt="UserAvatar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[100] w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/my-account/information">Thông tin tài khoản</Link>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#">Lịch sử giao dịch</Link>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              {(user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_GODADMIN')) && (
                <DropdownMenuItem>
                  <Link href="/admin/dashboard" target="_blank">
                    Admin dashboard
                  </Link>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Đăng xuất
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserDropDown;
