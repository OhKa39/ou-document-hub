'use client';

import { ColumnDef } from '@tanstack/react-table';
import toTitleCase from '@/utils/ToTitleCase';
import { DataTableColumnHeader } from '../DataTableColumnHeader/DataTableColumnHeader';
import { Checkbox } from '../ui/checkbox';
import DocumentType from '@/types/DocumentType';
import { DOCUMENT_STATUS } from '@/constants';
import Link from 'next/link';
import DocumentCellDropdown from '../admin/document-review/DocumentCellDropdown';
import convertToVietnameseDateTime from '@/utils/ConvertToVietnameseDateTime';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DocumentReviewColumn: ColumnDef<DocumentType>[] = [
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
    accessorKey: 'documentId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã tài liệu" />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên tài liệu" />,
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <p>
          <Link href={`/${row.original.shortUrl}`}>{toTitleCase(name)}</Link>
        </p>
      );
    },
  },
  {
    accessorKey: 'documentType',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Loại tài liệu" />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian tạo" />,
    cell: ({ row }) => {
      const name = row.getValue('createdAt') as string;
      return <p>{convertToVietnameseDateTime(name)}</p>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái phê duyệt" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const objectGet = DOCUMENT_STATUS[status];
      return (
        <div className="flex items-center space-x-2">
          {<objectGet.icon size={20} />}
          <p>{toTitleCase(objectGet.name)}</p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const document = row.original;

      return <DocumentCellDropdown document={document} />;
    },
  },
];

export default DocumentReviewColumn;
