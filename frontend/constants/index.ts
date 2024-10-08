import HeaderItemType from '@/types/HeaderItemType';
import SocialMediaType from '@/types/SocialMediaType';
import { IconType } from 'react-icons';
import { AiOutlineMessage } from 'react-icons/ai';
import { IoHeartOutline, IoMailOutline } from 'react-icons/io5';

export const passwordValidation = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,50}$/);
export const nameValidation = new RegExp(
  /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý]+(?:[-\s][A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý]+)*$/
);
export const YOUNGEST = 16;
export const OLDEST = 130;

export const GENDER = ['Male', 'Female', 'Other'];

export const CART_PROCESS_OPTIONS = [
  {
    id: 1,
    name: 'Free shipping',
    value: 'test1',
  },
  {
    id: 2,
    name: 'Express shipping',
    value: 'test2',
  },
  {
    id: 3,
    name: 'Pick up',
    value: 'test3',
  },
];

export const NAVBAR_ITEMS: HeaderItemType[] = [
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

export const PROCESS_STEPS: HeaderItemType[] = [
  {
    id: 1,
    name: 'Xử lý giỏ hàng',
    link: '#',
  },
  {
    id: 2,
    name: 'Thông tin thanh toán',
    link: '#',
  },
  {
    id: 3,
    name: 'Hoàn tất thanh toán',
    link: '#',
  },
];

export const SOCIAL_MEDIAS: SocialMediaType[] = [
  {
    id: 1,
    url: 'facebook',
    link: `/oauth2/authorization/facebook`,
  },
  {
    id: 2,
    url: 'google',
    link: `/oauth2/authorization/google`,
  },
];

export const MENU_ITEMS: HeaderItemType[] = [
  {
    id: 1,
    link: '#',
    name: 'Kho Tài Liệu',
  },
  {
    id: 2,
    link: '#',
    name: 'Kênh Người Bán',
  },
  {
    id: 3,
    link: '#',
    name: 'Tìm Kiếm',
  },
  {
    id: 4,
    link: '#',
    name: 'Thông Tin Cá Nhân',
  },
  {
    id: 5,
    link: '#',
    name: 'Thống Kê',
  },
];

type subMenuItemType = HeaderItemType & {
  icon: IconType;
};

export const SUB_MENU_ITEMS: subMenuItemType[] = [
  {
    id: 1,
    link: '#',
    name: 'Hòm thư phản hồi',
    icon: IoMailOutline,
  },
  {
    id: 2,
    link: '#',
    name: 'Tin nhắn',
    icon: AiOutlineMessage,
  },
  {
    id: 3,
    link: '#',
    name: 'Tài liệu yêu thích',
    icon: IoHeartOutline,
  },
];

type AdminNavType = HeaderItemType & {
  iconLink: string;
};

export const ADMIN_NAV_ITEMS: AdminNavType[] = [
  {
    id: 1,
    link: '/admin/dashboard',
    name: 'Dashboard',
    iconLink: '/Clock.svg',
  },
  {
    id: 2,
    link: '/admin/user-management',
    name: 'User Management',
    iconLink: '/Team.svg',
  },
  {
    id: 3,
    link: '#',
    name: 'Document Review',
    iconLink: '/OrderList.svg',
  },
  {
    id: 4,
    link: '#',
    name: 'Document List',
    iconLink: '/Products.svg',
  },
  {
    id: 5,
    link: '#',
    name: 'Inbox',
    iconLink: '/Inbox.svg',
  },
  {
    id: 6,
    link: '#',
    name: 'Feedback',
    iconLink: '/FeedBack.svg',
  },
  {
    id: 7,
    link: '#',
    name: 'Analytics',
    iconLink: '/Analytics.svg',
  },
  {
    id: 8,
    link: '#',
    name: 'Logout',
    iconLink: '/LogOut.svg',
  },
];

export const DASHBOARD_ITEMS = [
  {
    name: 'Total User',
    iconLink: '/Icon-3.svg',
  },
  {
    name: 'Total Order',
    iconLink: '/Icon-2.svg',
  },
  {
    name: 'Total Sales',
    iconLink: '/Icon-1.svg',
  },
  {
    name: 'Total Pending',
    iconLink: '/Icon.svg',
  },
];

export const MYACCOUNT_SIDEBAR_ITEMS: HeaderItemType[] = [
  {
    name: 'Thông tin cá nhân',
    link: '/my-account/information',
    id: 1,
  },
  {
    name: 'Thẻ ngân hàng',
    link: '/my-account/payment-cards',
    id: 2,
  },
  {
    name: 'Đăng xuất',
    link: '#',
    id: 3,
  },
];
