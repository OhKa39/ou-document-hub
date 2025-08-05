import { DOCUMENT_STATUS_ITEM_TYPE, DOCUMENT_STATUS_TYPE } from '@/types/DocumentStatusType';
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
    link: '/seller-channel/add-document',
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
    name: 'Quản lý người dùng',
    iconLink: '/Team.svg',
  },
  {
    id: 3,
    link: '/admin/document-review',
    name: 'Phê duyệt tài liệu',
    iconLink: '/OrderList.svg',
  },
  {
    id: 4,
    link: '/admin/faculty-management',
    name: 'Quản lý ngành học',
    iconLink: '/ProductStock.svg',
  },
  {
    id: 5,
    link: '/admin/shipping-address-management',
    name: 'Quản lý cơ sở',
    iconLink: '/Todo.svg',
  },
  {
    id: 6,
    link: '/admin/documents',
    name: 'Danh sách tài liệu',
    iconLink: '/Products.svg',
  },
  {
    id: 7,
    link: '/admin/inbox',
    name: 'Tin nhắn',
    iconLink: '/Inbox.svg',
  },
  {
    id: 8,
    link: '/admin/feedbacks',
    name: 'Phản hồi',
    iconLink: '/FeedBack.svg',
  },
  {
    id: 9,
    link: '/admin/analytics',
    name: 'Phân tích & báo cáo',
    iconLink: '/Analytics.svg',
  },
  {
    id: 10,
    link: '#',
    name: 'Đăng xuất',
    iconLink: '/LogOut.svg',
  },
];

export const DASHBOARD_ITEMS: any = [
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
    id: 1,
    name: 'Thông tin cá nhân',
    link: '/my-account/information',
  },
  {
    id: 2,
    name: 'Thẻ ngân hàng',
    link: '/my-account/payment-cards',
  },
  {
    id: 3,
    name: 'Đăng xuất',
    link: '#',
  },
];

export const SELLER_SIDEBAR_ITEM: AdminNavType[] = [
  { id: 1, link: '/seller-channel/add-document', name: 'Thêm tài liệu', iconLink: '/Products.svg' },
  { id: 2, link: '/seller-channel/documents', name: 'Danh sách tài liệu', iconLink: '/OrderList.svg' },
  { id: 3, link: '/seller-channel', name: 'Trang của tôi', iconLink: '/Analytics.svg' },
];
import { PiProhibitBold } from 'react-icons/pi';
import { MdOutlineCancel, MdOutlineDone, MdOutlineAutoMode } from 'react-icons/md';

export const DOCUMENT_STATUS: DOCUMENT_STATUS_TYPE = {
  Not_Verified: { name: 'Đang chờ', icon: MdOutlineAutoMode },
  Verified: { name: 'Đã xác nhận', icon: MdOutlineDone },
  Decline: { name: 'Từ chối', icon: MdOutlineCancel },
};
