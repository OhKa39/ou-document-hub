'use client';

import { ColumnDef } from '@tanstack/react-table';
import FacultyCellDropdown from '../admin/faculty-management/FacultyCellDropdown';
import FacultyType from '@/types/FacultyType';
import toTitleCase from '@/utils/ToTitleCase';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const facultyColumns: ColumnDef<FacultyType>[] = [
  {
    accessorKey: 'facultyID',
    header: 'Mã ngành học',
  },
  {
    accessorKey: 'facultyName',
    header: 'Tên ngành học',
    cell: ({ row }) => {
      const name = row.getValue('facultyName') as string;
      return <p>{toTitleCase(name)}</p>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const faculty = row.original;

      return <FacultyCellDropdown faculty={faculty} />;
    },
  },
];

export default facultyColumns;
