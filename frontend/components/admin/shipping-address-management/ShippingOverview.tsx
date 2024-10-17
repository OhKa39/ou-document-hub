import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IoMdAddCircleOutline } from 'react-icons/io';
import FacultyForm from '@/components/Forms/FacultyForm';
import shippingAddressColumns from '@/components/Columns/shipping_addresses_column';
import { DataTable } from '@/components/ui/data-table';
import { getShippingAddresses } from '@/lib/API/shipping_addresses';
import ShippingAddressForm from '@/components/Forms/ShippingAddressForm';

const ShippingOverview = async () => {
  const data = await getShippingAddresses();
  // console.log(data.data.content);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan cơ sở học tập</CardTitle>
        <CardDescription>Xem và chỉnh sửa cơ sở học tập</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between pb-4">
          <div className="relative h-[32px] w-[250px]">
            <Input className="w-full rounded-md" placeholder="Lọc cơ sở vận chuyển..." />
          </div>
          <div className="flex items-end gap-4">
            <Dialog>
              <DialogTrigger>
                <IoMdAddCircleOutline size="32" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm thông tin cơ sở học tập</DialogTitle>
                  <ShippingAddressForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable columns={shippingAddressColumns} data={data.data?.content ?? []} />
      </CardContent>
    </Card>
  );
};

export default ShippingOverview;
