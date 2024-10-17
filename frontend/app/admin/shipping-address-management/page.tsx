import AddButton from '@/components/admin/shipping-address-management/AddButton';
import ShippingOverview from '@/components/admin/shipping-address-management/ShippingOverview';
import shippingAddressColumns from '@/components/Columns/shipping_addresses_column';
import DataTableOverview from '@/components/DataTableOverview/DataTableOverview';
import { getShippingAddresses } from '@/lib/API/shipping_addresses';
import React from 'react';

const ShippingAddressPage = async () => {
  const data = await getShippingAddresses();
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">Quản lý cơ sở vận chuyển</p>
      <DataTableOverview
        data={data}
        columns={shippingAddressColumns}
        title={'Tổng quan cơ sở'}
        description={'Xem và chỉnh sửa cơ sở'}
        AddButton={<AddButton />}
        searchPlaceholder="Lọc cơ sở..."
      />
    </div>
  );
};

export default ShippingAddressPage;
