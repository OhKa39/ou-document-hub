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
import FacultyForm from '@/components/Forms/FacultyForm';

const AddButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <IoMdAddCircleOutline size="32" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm thông tin ngành học</DialogTitle>
          <FacultyForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddButton;
