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
import { deleteFaculty } from '@/actions/faculties';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FacultyForm from '@/components/Forms/FacultyForm';

type props = {
  faculty: any;
};

const handleDeleteFaculty = async (id: string) => {
  const dataResponse = await deleteFaculty(id);
};

const FacultyCellDropdown = ({ faculty }: props) => {
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(faculty.facultyID)}>
          Sao chép ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Chỉnh sửa thông tin ngành học</DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin ngành học</DialogTitle>
              <FacultyForm facultyName={faculty.facultyName} facultyID={faculty.facultyID} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem onClick={() => handleDeleteFaculty(faculty.facultyID)}>Xóa ngành học</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FacultyCellDropdown;
