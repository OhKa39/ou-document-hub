import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { UserStoreProvider } from '@/components/providers/UserProvider';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hệ thống quản lý tài liệu OU',
  description: 'ĐÒ ÁN NGÀNH - KHÓA LUẬN TỐT NGHIỆP - ĐỀ TÀI: HỆ THỐNG QUẢN LÝ TÀI LIỆU',
};

export default function RootLayout({
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
            <Navbar />
            {children}
            <Footer />
          </UserStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
