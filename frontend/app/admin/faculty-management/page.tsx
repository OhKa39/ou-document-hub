import FacultyOverview from '@/components/admin/faculty-management/FacultyOverview';
import AddButton from '@/components/admin/faculty-management/AddButton';
import facultyColumns from '@/components/Columns/faculty_column';
import DataTableOverview from '@/components/DataTableOverview/DataTableOverview';
import { getFaculties } from '@/lib/API/faculties';
import React from 'react';

const FacultyManagementPage = async () => {
  const data = await getFaculties();
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">Quản lý ngành học</p>
      <DataTableOverview
        data={data.data?.content ?? []}
        columns={facultyColumns}
        title={'Tổng quan ngành học'}
        description={'Xem và chỉnh sửa ngành học'}
        AddButton={<AddButton/>}
        searchPlaceholder="Lọc ngành học..."
      />
    </div>
  );
};

export default FacultyManagementPage;
