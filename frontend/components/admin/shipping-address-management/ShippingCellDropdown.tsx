import React from 'react';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteShippingAddress } from '@/actions/shipping_addresses';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ShippingAddressForm from '@/components/Forms/ShippingAddressForm';

type props = {
  shippingAddress: any;
};

const handleDeleteShippingAddress = async (id: string) => {
  const dataResponse = await deleteShippingAddress(id);
};

const ShippingAddressCellDropdown = ({ shippingAddress }: props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(shippingAddress.addressId)}>
          Sao chép ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Chỉnh sửa thông tin cơ sở</DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin cơ sở</DialogTitle>
              <ShippingAddressForm
                shippingAddressName={shippingAddress.addressName}
                shippingAddressID={shippingAddress.addressId}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem onClick={() => handleDeleteShippingAddress(shippingAddress.addressId)}>
          Xóa cơ sở
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShippingAddressCellDropdown;
