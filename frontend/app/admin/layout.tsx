import type { Metadata } from 'next';
import { Inter, Nunito_Sans } from 'next/font/google';
import '../globals.css';
import { UserStoreProvider } from '@/components/providers/UserProvider';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';
import AdminNavbar from '@/components/AdminNavbar/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar.tsx/AdminSidebar';
import GlobalAdminProvider from '@/components/providers/GlobalAdminProvider';

const inter = Nunito_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OUDocumentHub - Admin Dashboard',
  description: 'ĐÒ ÁN NGÀNH - KHÓA LUẬN TỐT NGHIỆP - ĐỀ TÀI: HỆ THỐNG QUẢN LÝ TÀI LIỆU',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <UserStoreProvider>
            <Toaster />
            <GlobalAdminProvider>
              <main className="h-screen max-w-[1544px] 2xl:mx-auto">{children}</main>
            </GlobalAdminProvider>
          </UserStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
