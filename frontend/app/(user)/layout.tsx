'use client';

import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { UserStoreProvider } from '@/components/providers/UserProvider';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { CartStoreProvider } from '@/components/providers/CartProvider';
import { DocumentDraftStoreProvider } from '@/components/providers/DocumentDraftProvider';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import ChatComponent from '@/components/ChatComponent/ChatComponent';
import { usePathname } from 'next/navigation';
import { LoginRequiredDialog } from '@/components/LoginRequiredComponent';

const inter = Inter({ subsets: ['latin'] });

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <UserStoreProvider>
            <CartStoreProvider>
              <DocumentDraftStoreProvider>
                <LoginRequiredDialog />
                <Toaster />
                <Navbar />
                {children}
                <Footer />
                <ChatComponent />
              </DocumentDraftStoreProvider>
            </CartStoreProvider>
          </UserStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
