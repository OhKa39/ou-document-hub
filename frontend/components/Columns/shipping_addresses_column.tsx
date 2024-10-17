'use client';

import { ColumnDef } from '@tanstack/react-table';
import ShippingAddressCellDropdown from '../admin/shipping-address-management/ShippingCellDropdown';
import ShippingAddressType from '@/types/ShippingAddressType';
import toTitleCase from '@/utils/ToTitleCase';
import { DataTableColumnHeader } from '../DataTableColumnHeader/DataTableColumnHeader';
import { Checkbox } from '../ui/checkbox';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const shippingAddressColumns: ColumnDef<ShippingAddressType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'addressId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã cơ sở" />,
  },
  {
    accessorKey: 'addressName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên cơ sở" />,
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
