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
    name: 'Free shipping',
    value: 'test1',
  },
  {
    name: 'Express shipping',
    value: 'test2',
  },
  {
    name: 'Pick up',
    value: 'test3',
  },
];

export const NAVBAR_ITEMS: HeaderItemType[] = [
  {
    name: 'Trang Chủ',
    link: '/',
  },
  {
    name: 'Kho Tài Liệu',
    link: '/documents',
  },
  {
    name: 'Kênh Người Bán',
    link: '/seller-channel/add-document',
  },
];

export const PROCESS_STEPS: HeaderItemType[] = [
  {
    name: 'Xử lý giỏ hàng',
    link: '#',
  },
  {
    name: 'Thông tin thanh toán',
    link: '#',
  },
  {
    name: 'Hoàn tất thanh toán',
    link: '#',
  },
];

export const SOCIAL_MEDIAS: SocialMediaType[] = [
  {
    url: 'facebook',
    link: `/oauth2/authorization/facebook`,
  },
  {
    url: 'google',
    link: `/oauth2/authorization/google`,
  },
];

export const MENU_ITEMS: HeaderItemType[] = [
  {
    link: '#',
    name: 'Kho Tài Liệu',
  },
  {
    link: '#',
    name: 'Kênh Người Bán',
  },
  {
    link: '#',
    name: 'Tìm Kiếm',
  },
  {
    link: '#',
    name: 'Thông Tin Cá Nhân',
  },
  {
    link: '#',
    name: 'Thống Kê',
  },
];

type subMenuItemType = HeaderItemType & {
  icon: IconType;
};

export const SUB_MENU_ITEMS: subMenuItemType[] = [
  {
    link: '#',
    name: 'Hòm thư phản hồi',
    icon: IoMailOutline,
  },
  {
    link: '#',
    name: 'Tin nhắn',
    icon: AiOutlineMessage,
  },
  {
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
    link: '/admin/dashboard',
    name: 'Dashboard',
    iconLink: '/Clock.svg',
  },
  {
    link: '/admin/user-management',
    name: 'Quản lý người dùng',
    iconLink: '/Team.svg',
  },
  {
    link: '/admin/document-review',
    name: 'Phê duyệt tài liệu',
    iconLink: '/OrderList.svg',
  },
  {
    link: '/admin/faculty-management',
    name: 'Quản lý ngành học',
    iconLink: '/ProductStock.svg',
  },
  {
    link: '/admin/shipping-address-management',
    name: 'Quản lý cơ sở',
    iconLink: '/Todo.svg',
  },
  {
    link: '/admin/documents',
    name: 'Danh sách tài liệu',
    iconLink: '/Products.svg',
  },
  {
    link: '/admin/inbox',
    name: 'Tin nhắn',
    iconLink: '/Inbox.svg',
  },
  {
    link: '/admin/feedbacks',
    name: 'Phản hồi',
    iconLink: '/FeedBack.svg',
  },
  {
    link: '/admin/analytics',
    name: 'Phân tích & báo cáo',
    iconLink: '/Analytics.svg',
  },
  {
    link: '#',
    name: 'Đăng xuất',
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
  },
  {
    name: 'Thẻ ngân hàng',
    link: '/my-account/payment-cards',
  },
  {
    name: 'Đăng xuất',
    link: '#',
  },
];

export const SELLER_SIDEBAR_ITEM: AdminNavType[] = [
  { link: '/seller-channel/add-document', name: 'Thêm tài liệu', iconLink: '/Products.svg' },
  { link: '/seller-channel/documents', name: 'Danh sách tài liệu', iconLink: '/OrderList.svg' },
  { link: '/seller-channel/analytics', name: 'Phân tích & báo cáo', iconLink: '/Analytics.svg' },
];
