import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { UserStoreProvider } from '@/components/providers/UserProvider';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { CartStoreProvider } from '@/components/providers/CartProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OUDocumentHub - Hệ thống quản lý tài liệu OU',
  description: 'ĐÒ ÁN NGÀNH - KHÓA LUẬN TỐT NGHIỆP - ĐỀ TÀI: HỆ THỐNG QUẢN LÝ TÀI LIỆU',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <UserStoreProvider>
            <CartStoreProvider>
              <Toaster />
              <Navbar />
              <main className="max-w-[1544px] 2xl:mx-auto">{children}</main>
              <Footer />
            </CartStoreProvider>
          </UserStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
