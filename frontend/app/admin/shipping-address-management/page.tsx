import ShippingOverview from '@/components/admin/shipping-address-management/ShippingOverview';
import React from 'react';

const ShippingAddressPage = () => {
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">Quản lý cơ sở vận chuyển</p>
      <ShippingOverview />
    </div>
  );
};

export default ShippingAddressPage;
