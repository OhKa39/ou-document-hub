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
import facultyColumns from '@/components/Columns/faculty_column';
import { DataTable } from '@/components/ui/data-table';
import { getFaculties } from '@/lib/API/faculties';

const FacultyOverview = async () => {
  const data = await getFaculties();
  // console.log(data.data.content);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan ngành học</CardTitle>
        <CardDescription>Xem và chỉnh sửa ngành học</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between pb-4">
          <div className="relative h-[32px] w-[250px]">
            <Input className="w-full rounded-md" placeholder="Lọc ngành học..." />
          </div>
          <div className="flex items-end gap-4">
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
          </div>
        </div>
        <DataTable columns={facultyColumns} data={data.data?.content ?? []} />
      </CardContent>
    </Card>
  );
};

export default FacultyOverview;
