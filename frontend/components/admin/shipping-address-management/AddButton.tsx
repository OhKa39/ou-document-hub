'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IoMdAddCircleOutline } from 'react-icons/io';
import ShippingAddressForm from '@/components/Forms/ShippingAddressForm';

const AddButton = () => {
  return (
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
  );
};

export default AddButton;
