'use client';
import { useEffect, useState } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserStore } from '../providers/UserProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '../providers/CartProvider';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import Link from 'next/link';

type props = {
  data: any;
  isError: boolean;
  error: any;
};

const UserDropDown = ({ data, isError, error }: props) => {
  const { user, isAuthenticated, setUser, logOut } = useUserStore((state) => state);
  const { resetCart } = useCartStore((state) => state);
  const router = useRouter();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setUser(data.data);
      setIsSessionExpired(false); // Close dialog if session is valid
    } else if (isError) {
      if (isAuthenticated) {
        setIsSessionExpired(true);
        resetCart();
      }
      logOut();
    }
  }, [data, isError, error, setUser, logOut, resetCart, router]);

  const handleLogout = () => {
    try {
      logOut(); // Clear user state
      resetCart(); // Clear cart
      setIsSessionExpired(false); // Close dialog
      // Wait a moment before navigating
      setTimeout(() => {
        router.push('/sign-in');
      }, 50);
    } catch (err) {
      console.error('Logout navigation error:', err);
    }
  };

  const handleDialogClose = () => {
    setIsSessionExpired(false); // Close dialog
    try {
      // Wait a moment before navigating
      setTimeout(() => {
        router.push('/sign-in');
      }, 50);
    } catch (err) {
      console.error('Dialog close navigation error:', err);
    }
  };

  return (
    <div className="hidden lg:block">
      {!isAuthenticated ? (
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
              {user?.avatarLink ? (
                <Image
                  className="absolute left-0 top-0 object-cover"
                  src={user.avatarLink}
                  alt="UserAvatar"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <HiOutlineUserCircle size="30" />
              )}
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
                <Link href="/orders">Lịch sử giao dịch</Link>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              {(user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_GODADMIN')) && (
                <DropdownMenuItem>
                  <Link href="/admin/dashboard" target="_blank">
                    Admin dashboard
                  </Link>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              {/* <DropdownMenuItem> */}
              {/*   Keyboard shortcuts */}
              {/*   <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
              {/* </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Đăng xuất
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Session Expired Dialog */}
      <Dialog open={isSessionExpired} onOpenChange={setIsSessionExpired}>
        <DialogContent className="z-[9999]">
          <DialogHeader>
            <DialogTitle>Phiên đăng nhập đã hết hạn</DialogTitle>
            <DialogDescription>
              Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Đăng nhập lại</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDropDown;
