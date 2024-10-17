'use client';

import { ColumnDef } from '@tanstack/react-table';
import ShippingAddressCellDropdown from '../admin/shipping-address-management/ShippingCellDropdown';
import ShippingAddressType from '@/types/ShippingAddressType';
import toTitleCase from '@/utils/ToTitleCase';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const shippingAddressColumns: ColumnDef<ShippingAddressType>[] = [
  {
    accessorKey: 'addressId',
    header: 'Mã cơ sở',
  },
  {
    accessorKey: 'addressName',
    header: 'Tên cơ sở',
    cell: ({ row }) => {
      const name = row.getValue('addressName') as string;
      return <p>{toTitleCase(name)}</p>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const shippingAddress = row.original;

      return <ShippingAddressCellDropdown shippingAddress={shippingAddress} />;
    },
  },
];

export default shippingAddressColumns;
