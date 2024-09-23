import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

import documents from '@/__mocks__/data/documents';
import { IoCloseSharp } from 'react-icons/io5';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import CartProcessForm from '@/components/Forms/CartProcessForm';

const CartProcess = () => {
  return (
    <div className="mt-10 flex h-fit w-full flex-col gap-16 lg:mt-20 lg:flex-row">
      {/* List of order document */}
      <div className="custom-scrollbar max-h-[482px] w-full overflow-y-scroll lg:min-w-[643px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[1px] border-[#6c7275]">
              <TableHead className="w-full text-2xl font-semibold text-black lg:w-[316px] lg:text-xl">
                Tài liệu
              </TableHead>
              <TableHead className="hidden text-center text-xl font-semibold text-black lg:table-cell">
                Số lượng
              </TableHead>
              <TableHead className="hidden text-center text-xl font-semibold text-black lg:table-cell">Giá</TableHead>
              <TableHead className="hidden text-center text-xl font-semibold text-black lg:table-cell">Tổng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents
              //   .filter((item) => item.id < 3)
              .map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="w-full lg:w-[316px]">
                    <div className="flex gap-4">
                      {/* image section */}
                      <div className="relative h-[104px] min-w-[88px] bg-[#F3F5F7]">
                        <Image
                          fill
                          src={document.image}
                          className="absolute top-2 h-[75%] w-[75%]"
                          style={{ objectFit: 'contain' }}
                          alt="Image Document"
                        />
                      </div>
                      <div className="flex flex-col gap-2 text-base">
                        <p className="text-ellipsis font-semibold text-black">{document.name}</p>
                        <p>Số lượng còn lại: 9</p>
                        <div className="flex cursor-pointer items-center gap-2">
                          <IoCloseSharp size={16} />
                          <p className="font-semibold text-[var(--neutral-04)]">Xóa</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-center text-xl lg:table-cell"></TableCell>
                  <TableCell className="hidden text-center text-xl lg:table-cell">15</TableCell>
                  <TableCell className="hidden text-center text-xl lg:table-cell">30</TableCell>
                </TableRow>
              ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>
      <div className="w-full rounded-sm border-[1px] border-[#6c7275] px-8 py-8">
        <p className="text-xl font-semibold">Tổng kết giỏ hàng</p>
        <CartProcessForm />
      </div>
    </div>
  );
};

export default CartProcess;
