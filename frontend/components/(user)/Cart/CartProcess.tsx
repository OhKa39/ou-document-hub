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

import CartProcessForm from '@/components/Forms/CartProcessForm';
import MinusButton from './MinusButton';
import CartItem from './CartItem';

const CartProcess = () => {
  return (
    <div className="mt-10 flex h-fit w-full flex-col gap-16 lg:mt-20 lg:flex-row">
      {/* List of order document */}
      <div className="custom-scrollbar max-h-[482px] w-full overflow-x-hidden overflow-y-scroll lg:min-w-[643px]">
        <Table className="max-w-full overflow-x-hidden">
          <TableHeader>
            <TableRow className="max-w-full border-b-[1px] border-[#6c7275]">
              <TableHead className="w-full text-2xl font-semibold text-black lg:w-[316px] lg:text-[18px]">
                Tài liệu
              </TableHead>
              <TableHead className="hidden text-center text-[18px] font-semibold text-black lg:table-cell lg:w-[120px]">
                Còn lại
              </TableHead>
              <TableHead className="hidden text-center text-[18px] font-semibold text-black lg:table-cell">
                Giá
              </TableHead>
              <TableHead className="hidden text-center text-[18px] font-semibold text-black lg:table-cell">
                Tổng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents
              //   .filter((item) => item.id < 3)
              .map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="max-w-full lg:max-w-[316px]">
                    <CartItem document={document} />
                  </TableCell>
                  <TableCell className="hidden h-full w-full text-xl lg:m-auto lg:table-cell">
                    <div className="mx-auto h-[56px] w-[80px]">
                      <MinusButton />
                    </div>
                  </TableCell>
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
