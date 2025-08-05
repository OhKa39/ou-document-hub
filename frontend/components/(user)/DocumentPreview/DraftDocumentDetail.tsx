'use client';
import React, { useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MdOutlineReport } from 'react-icons/md';
import DocumentStatus from '../DocumentInformation/DocumentStatus';
import toTitleCase from '@/utils/ToTitleCase';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';
import { useDocumentDraftStore } from '@/components/providers/DocumentDraftProvider';
import { useRouter } from 'next/navigation';
import Carousel from 'react-multi-carousel';
import CustomDot from '@/components/Carousel/CustomDot';
import CustomLeftArrow from '@/components/Carousel/CustomLeftArrow';
import CustomRightArrow from '@/components/Carousel/CustomRightArrow';
import 'react-multi-carousel/lib/styles.css';
import Book1 from '@/public/Book1.webp';
import Book2 from '@/public/Book2.webp';
import Book3 from '@/public/Book3.webp';
import { useUserStore } from '@/components/providers/UserProvider';
import { notFound } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import DocumentSchema from '@/schemas/DocumentSchema';
import { UseFormReturn } from 'react-hook-form';
import { createDocument } from '@/actions/documents';

const testData = [Book1, Book2, Book3, Book2, Book1, Book3];

const DraftReview = () => {
  const { formData, clearFormData } = useDocumentDraftStore((state) => state);
  const { user: currentUser, isAuthenticated } = useUserStore((state) => state);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  interface SendDocumentParams {
    data: any;
    documentType: 'Online' | 'Paper';
    form?: UseFormReturn<z.infer<typeof DocumentSchema>>;
    setIsSuccess?: (value: boolean) => void;
  }

  const sendDocumentToBackend = async ({ data, documentType, form, setIsSuccess }: SendDocumentParams) => {
    try {
      // Create a new FormData object
      const formDataToSend = new FormData();
      const { name, description, price, faculty, documentType, thumbnail } = data;

      // Prepare the JSON part
      const paper =
        documentType === 'Paper' ? { stock: data['stock'], shippingAddresses: data['shippingAddresses'] } : {};

      const documentData = {
        name: data.name,
        description: data.description,
        price: data.price,
        faculty: data.faculty,
        documentType: data.documentType,
        ...paper,
      };

      formDataToSend.append('document', new Blob([JSON.stringify(documentData)], { type: 'application/json' }));

      // Add the file parts
      if (data.thumbnail) {
        formDataToSend.append('image', data.thumbnail);
      }

      if (documentType === 'Online' && data.onlineFile) {
        formDataToSend.append('onlineFile', data.onlineFile);
      }

      // Add gallery images as a single part with multiple files
      if (data.galleryImages && data.galleryImages.length > 0) {
        data.galleryImages.forEach((image: any) => {
          formDataToSend.append('galleryImages', image); // Append each file under the same part name
        });
      }

      // Send the request
      const res = await createDocument(formDataToSend);

      // Handle the response
      if (res.statusCode === 201) {
        if (form) form.reset();
        if (setIsSuccess) setIsSuccess(true);
        toast({
          variant: 'success',
          title: 'Thành công',
          description: 'Đã thêm tài liệu thành công',
        });
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Thông báo lỗi',
          description: 'Đã có lỗi xảy ra',
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Thông báo lỗi',
        description: 'Không thể kết nối đến server',
      });
      return false;
    }
  };

  // Redirect if no draft data
  useEffect(() => {
    if (!formData) {
      startTransition(() => {
        notFound();
      });
    }
  }, [formData]);

  if (!formData) {
    return <div>Loading draft data...</div>;
  }

  const { name, description, price, documentType, faculty, stock, thumbnail, galleryImages } = formData;

  const handleSave = async () => {
    if (!formData) return;

    // Since formData contains base64 strings for files, we need to convert them back to File objects
    const thumbnailFile = thumbnail
      ? new File([await (await fetch(thumbnail)).blob()], 'thumbnail.jpg', { type: 'image/jpeg' })
      : undefined;

    const galleryFiles = await Promise.all(
      (galleryImages || []).map(async (image, index) => {
        const blob = await (await fetch(image)).blob();
        return new File([blob], `gallery-${index}.jpg`, { type: 'image/jpeg' });
      })
    );

    const onlineFile = formData.onlineFile || undefined;

    const dataToSend = {
      name,
      description,
      price,
      faculty,
      documentType,
      stock: stock || 0,
      shippingAddresses: formData.shippingAddresses || [],
      thumbnail: thumbnailFile,
      galleryImages: galleryFiles,
      onlineFile,
    };

    const success = await sendDocumentToBackend({
      data: dataToSend,
      documentType: formData.documentType,
    });

    if (success) {
      clearFormData(); // Clear the draft after successful submission
      router.push('/documents'); // Redirect to a documents list page or homepage
    }
  };

  const handleClearDraft = () => {
    clearFormData();
    router.push('/documents');
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
      slidesToSlide: 2,
    },
  };

  return (
    <div className="flex h-fit flex-col lg:flex-row lg:gap-16">
      {/* Image section */}
      <div className="w-full gap-4 lg:min-w-[542px]">
        <div className="relative h-[450px] w-full bg-[#F3F5F7] sm:h-[550px] lg:h-[729px]">
          <div className="relative mx-auto h-full w-[80%]">
            {thumbnail ? (
              <Image src={thumbnail} fill className="object-contain" alt="Document Main Image" />
            ) : (
              <p>No thumbnail available</p>
            )}
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
            {galleryImages.length > 0
              ? galleryImages.map((image, index) => (
                  <div key={index} className="relative h-full w-full bg-white">
                    <Image src={image} fill className="object-contain" alt={`Gallery Image ${index}`} />
                  </div>
                ))
              : testData.map((image, index) => (
                  <div key={index} className="relative h-full w-full bg-white">
                    <Image src={image} fill className="object-contain" alt="Carousel" />
                  </div>
                ))}
          </Carousel>
        </div>
      </div>
      {/* Details section */}
      <div className="flex w-full flex-col">
        <div className="flex flex-col gap-4">
          <DocumentStatus isVerified={false} className="mt-4 h-[35px] w-[55%] sm:w-[45%] lg:mt-0 lg:w-[35%]" />
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 lg:flex-row lg:items-end lg:gap-4">
              <p className="text-base text-[var(--neutral-07)]">Draft - Not yet rated</p>
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
                  src={currentUser?.avatarLink || '/default-avatar.png'}
                  className="absolute"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className="text-xl">{(currentUser?.lastName || '') + ' ' + (currentUser?.firstName || '')}</p>
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
            <Button className="h-[52px] text-xl" onClick={handleSave} disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu tài liệu'}
            </Button>
            <Button
              variant="outline"
              className="h-[52px] border-2 border-red-500 text-xl text-red-500"
              onClick={handleClearDraft}
            >
              Xóa bản nháp
            </Button>
          </div>
          <div className="flex h-[96px] w-full items-center border-t-[1px] border-[var(--neutral-03)] pt-6">
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-10">
                <p className="w-[30%] text-[var(--neutral-04)]">Ngành học</p>
                <p className="w-full">{toTitleCase(faculty)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftReview;
