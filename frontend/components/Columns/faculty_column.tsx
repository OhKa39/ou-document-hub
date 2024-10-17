'use client';

import { ColumnDef } from '@tanstack/react-table';
import FacultyCellDropdown from '../admin/faculty-management/FacultyCellDropdown';
import FacultyType from '@/types/FacultyType';
import toTitleCase from '@/utils/ToTitleCase';
import { DataTableColumnHeader } from '../DataTableColumnHeader/DataTableColumnHeader';
import { Checkbox } from '../ui/checkbox';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const facultyColumns: ColumnDef<FacultyType>[] = [
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
    accessorKey: 'facultyID',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã ngành học" />,
  },
  {
    accessorKey: 'facultyName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên ngành học" />,
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
