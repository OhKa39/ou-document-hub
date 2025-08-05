'use client';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useTransition } from 'react';
import { Rating } from 'react-simple-star-rating';
import Image from 'next/image';
import MinusButton from '../Cart/MinusButton';
import Heart from '@/public/Hearth.svg';
import { MdOutlineReport } from 'react-icons/md';
import DocumentStatus from './DocumentStatus';
import toTitleCase from '@/utils/ToTitleCase';
import DocumentType from '@/types/DocumentType';
import { useUserStore } from '@/components/providers/UserProvider';
import { notFound } from 'next/navigation';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';
import { useCartStore } from '@/components/providers/CartProvider';
import Carousel from 'react-multi-carousel';
import CustomDot from '@/components/Carousel/CustomDot';
import CustomLeftArrow from '@/components/Carousel/CustomLeftArrow';
import CustomRightArrow from '@/components/Carousel/CustomRightArrow';
import Book1 from '@/public/Book1.webp';
import Book2 from '@/public/Book2.webp';
import Book3 from '@/public/Book3.webp';
import 'react-multi-carousel/lib/styles.css';

type Props = {
  document: DocumentType;
};
const testData = [Book1, Book2, Book3, Book2, Book1, Book3];

const DocumentDetails = ({ document }: Props) => {
  const { user: currentUser, isAuthenticated } = useUserStore((state) => state);
  const { items, addItem, postItem } = useCartStore((state) => state);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [currentImage, setCurrentImage] = useState(document.thumbnailUrl);
  console.log('document: ', document);

  const { tag, thumbnailUrl, description, price, user, status, name, documentType, documentId, facultyName, stock } =
    document;

  // Effect to check user loading state and trigger notFound
  useEffect(() => {
    if (isAuthenticated === false || currentUser !== null) {
      setIsUserLoading(false);
    }

    // Check for notFound after hydration
    if (!isUserLoading && status !== 'Verified') {
      if (!currentUser || (!currentUser.roles?.includes('ROLE_ADMIN') && currentUser.userId !== user?.userId)) {
        console.log('Triggering notFound');
        startTransition(() => {
          notFound();
        });
      }
    }
  }, [isAuthenticated, currentUser, isUserLoading, status, user]);

  // Initialize cart item after hooks
  const cartItem = items.find((item) => item.documentId === documentId);

  // Update value when cartItem changes
  useEffect(() => {
    if (cartItem?.quantity) {
      setValue(cartItem.quantity);
    }
  }, [cartItem]);

  // Early return after all hooks
  if (isUserLoading || isPending) {
    return <div>Loading document information...</div>;
  }

  const handleAddToCart = () => {
    if (currentUser?.userId === user?.userId) {
      return;
    }
    if (value > 0) {
      addItem({ documentId, price, quantity: value });
      postItem(isAuthenticated);
    }
  };
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
  };

  return (
    <div className="flex h-fit flex-col lg:flex-row lg:gap-16">
      {/* Image section */}
      <div className="w-full gap-4 lg:min-w-[542px]">
        <div className="relative h-[450px] w-full bg-[#F3F5F7] sm:h-[550px] lg:h-[729px]">
          <div className="absolute left-8 top-8 z-[99] w-[25%] overflow-hidden bg-white text-center text-xl drop-shadow-md lg:left-10 lg:top-10 lg:w-[15%] lg:text-2xl">
            {tag && (
              <p className="font-bold" data-testid="Tag">
                {tag}
              </p>
            )}
          </div>
          <div className="relative mx-auto h-full w-[80%]">
            <Image src={currentImage} priority fill className="object-contain" alt="Document Main Image" />
          </div>
        </div>
        <div className="mt-4 w-full">
          <Carousel
            responsive={responsive}
            draggable
            showDots={false}
            arrows
            containerClass="carousel-container"
            itemClass="h-[167px] px-2"
            partialVisible={false}
            rewindWithAnimation
            customDot={<CustomDot />}
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
          >
            {testData.map((image, index) => (
              <div key={index} className="relative h-full w-full bg-white">
                <Image
                  src={image}
                  priority
                  fill
                  className="object-contain hover:cursor-pointer"
                  alt="Carousel"
                  onClick={() => {
                    setCurrentImage(image.src);
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      {/* Details section */}
      <div className="flex w-full flex-col">
        <div className="flex flex-col gap-4">
          <DocumentStatus
            isVerified={status === 'Verified'}
            className="mt-4 h-[35px] w-[55%] sm:w-[45%] lg:mt-0 lg:w-[35%]"
          />
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 lg:flex-row lg:items-end lg:gap-4">
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
          <h1 className="text-5xl font-bold">{name}</h1>
          <p className="text-xl text-[var(--neutral-04)]">{description}</p>
          <p className="text-2xl font-semibold text-[#B30000]" data-testid="DocumentPrice">
            {ToVietnameseCurrency(price)}
          </p>
          <div className="flex flex-col space-y-2">
            <p className="text-xl text-[var(--neutral-04)]">Người đăng: </p>
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8 rounded-full">
                <Image
                  alt="User Avatar"
                  src={user?.avatarLink || '/default-avatar.png'}
                  className="absolute"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className="text-xl">{(user?.lastName || '') + ' ' + (user?.firstName || '')}</p>
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
            <div className="flex w-full space-x-4">
              <div className="min-w-[30%] lg:h-[52px]">
                <MinusButton
                  value={value}
                  setValue={setValue}
                  price={price}
                  isInputDisable={false}
                  documentId={documentId}
                  isInPageDetail={true}
                />
              </div>
              <Button variant={'outline'} className="flex h-[52px] w-full space-x-4 border-2 border-black text-xl">
                <Image src={Heart} alt="Hearth Icon" width={24} height={24} />
                Yêu thích
              </Button>
            </div>
            <Button className="h-[52px] text-xl" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </Button>
            <Button className="h-[52px] text-xl">Mua ngay</Button>
          </div>
          <div className="flex h-[96px] w-full items-center border-t-[1px] border-[var(--neutral-03)] pt-6">
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-10">
                <p className="w-[30%] text-[var(--neutral-04)]">Mã tài liệu</p>
                <p className="w-full">{documentId}</p>
              </div>
              <div className="flex gap-10">
                <p className="w-[30%] text-[var(--neutral-04)]">Ngành học</p>
                <p className="w-full">{toTitleCase(facultyName!)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
