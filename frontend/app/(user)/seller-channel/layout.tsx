import SellerChannelSidebar from '@/components/SellerChannelSidebar/SellerChannelSidebar';

export default function SellerChannelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:flex-row">
      <SellerChannelSidebar />
      {children}
    </div>
  );
}
