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
import { reviewDocument } from '@/actions/documents';

type props = {
  document: any;
};

const handleDeleteDocument = async (id: string) => {};

const handleReviewDocument = async (id: string, status: string) => {
  const data = reviewDocument(id, status);
};

const DocumentCellDropdown = ({ document }: props) => {
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(document.documentId)}>
          Sao chép ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteDocument(document.documentId)}>Xóa tài liệu</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleReviewDocument(document.documentId, document.status)}
        >{`${document.status === 'Verified' ? 'Hủy phê duyệt tài liệu' : 'Phê duyệt tài liệu'}`}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DocumentCellDropdown;
