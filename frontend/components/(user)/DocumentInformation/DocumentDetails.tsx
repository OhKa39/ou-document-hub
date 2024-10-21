'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Rating } from 'react-simple-star-rating';
import documents from '@/__mocks__/data/documents';
import Image from 'next/image';
import user from '@/__mocks__/data/user';
import MinusButton from '../Cart/MinusButton';
import Heart from '@/public/Hearth.svg';
import { MdOutlineReport } from 'react-icons/md';
import DocumentStatus from './DocumentStatus';
import toTitleCase from '@/utils/ToTitleCase';
import DocumentType from '@/types/DocumentType';
import { useUserStore } from '@/components/providers/UserProvider';
import { notFound } from 'next/navigation';

type props = {
  document: DocumentType;
};

const DocumentDetails = ({ document }: props) => {
  // const document = documents[0];
  // const tag = documents[0].tag;
  const { user: currentUser } = useUserStore((state) => state);
  const { tag, thumbnailUrl, description, price, user, status, documentType, documentId, facultyName, stock } =
    document;
  if (status !== 'Verified') {
    if (!currentUser?.roles.includes('ROLE_ADMIN') && currentUser?.userId !== user?.userId) notFound();
  }
  return (
    <div className="flex h-fit flex-col lg:flex-row lg:gap-16">
      {/* image section */}
      <div className="flex w-full flex-col gap-4 lg:min-w-[542px]">
        {/* main image */}
        <div className="relative h-[729px] w-full bg-[#F3F5F7]">
          <div className="absolute left-10 top-10 z-[99] w-[15%] overflow-hidden bg-white text-center text-2xl drop-shadow-md">
            {tag && (
              <p className="font-bold" data-testid="Tag">
                {tag}
              </p>
            )}
          </div>
          <div className="relative mx-auto h-full w-[80%]">
            <Image src={thumbnailUrl} priority fill className="object-contain" alt="Document Main Image" />
          </div>
        </div>
        {/* image list */}
        <div className="hidden gap-4 lg:flex"></div>
      </div>
      {/* details section */}
      <div className="flex w-full flex-col">
        {/* header */}
        <div className="flex flex-col gap-4">
          {/* status section */}
          <DocumentStatus isVerified={status === 'Verified'} className="h-[30px] w-[25%]" />
          {/* star section */}
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-4">
              <Rating
                initialValue={5}
                readonly={true}
                size={28}
                SVGstyle={{ display: 'inline' }}
                fillColor="#FFAB08"
                data-testid="Stars"
              />
              <p className="text-base text-[var(--neutral-07)]">11 người đánh giá</p>
            </div>
            <MdOutlineReport size={32} className="text-red-700" />
          </div>
          <h1 className="text-5xl font-bold">Tray Table</h1>
          <p className="text-xl text-[var(--neutral-04)]">{description}</p>
          <p className="text-2xl font-semibold text-[#B30000]" data-testid="DocumentPrice">
            {Number(price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
          </p>
          <div className="flex flex-col space-y-2">
            <p className="text-xl text-[var(--neutral-04)]">Người đăng: </p>
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8 rounded-full">
                <Image
                  alt="User Avatar"
                  src={user!.avatarLink}
                  className="absolute"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className="text-xl">{user!.lastName + ' ' + user!.firstName}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-xl text-[var(--neutral-04)]">Loại tài liệu/sách: </p>
            <p className="text-xl">{documentType === 'Online' ? 'Online' : 'Giấy'}</p>
          </div>
          {documentType === 'Paper' && (
            <div className="flex flex-col space-y-2">
              <p className="text-xl text-[var(--neutral-04)]">Số lượng tồn kho: </p>
              <p className="text-xl">{stock}</p>
            </div>
          )}
          <div className="flex flex-col space-y-4 border-t-[1px] border-[var(--neutral-03)] pt-4">
            <div className="flex space-x-4">
              <div className="h-[52px] w-[127px]">
                <MinusButton />
              </div>
              <Button variant={'outline'} className="flex h-[52px] w-full space-x-4 border-2 border-black text-xl">
                <Image src={Heart} alt="Hearth Icon" width={24} height={24} />
                Thêm vào yêu thích
              </Button>
            </div>
            <Button className="h-[52px] text-xl">Thêm vào giỏ hàng</Button>
            <Button className="h-[52px] text-xl">Mua ngay</Button>
          </div>
          <div className="mt-4 flex h-[96px] w-full items-center border-t-[1px] border-[var(--neutral-03)]">
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-10">
                <p className="w-[30%] text-[var(--neutral-04)]">Mã tài liệu</p>
                <p className="w-full">{documentId}</p>
              </div>
              <div className="flex gap-10">
                <p className="w-[30%] text-[var(--neutral-04)]">Ngành học</p>
                <p className="w-full">{toTitleCase(facultyName)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
