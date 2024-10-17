import FacultyOverview from '@/components/admin/faculty-management/FacultyOverview';
import React from 'react';

const FacultyManagementPage = () => {
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">Quản lý ngành học</p>
      <FacultyOverview />
    </div>
  );
};

export default FacultyManagementPage;
