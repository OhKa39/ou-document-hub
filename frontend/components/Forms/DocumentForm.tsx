'use client';
import DocumentSchema from '@/schemas/DocumentSchema';
import React, { useCallback, useState } from 'react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import ShippingAddressType from '@/types/ShippingAddressType';
import FacultyType from '@/types/FacultyType';
import toTitleCase from '@/utils/ToTitleCase';
import { createDocument } from '@/actions/documents';
import { useToast } from '../ui/use-toast';
import CustomSubmitButton from './CustomSubmitButton';
import { useDropzone } from 'react-dropzone';
import { useDocumentDraftStore } from '../providers/DocumentDraftProvider';
import { useRouter } from 'next/navigation';
import fileToBase64 from '@/utils/FileToBase64';

type props = {
  faculties: FacultyType[];
  shippingAddresses: ShippingAddressType[];
};

const DocumentForm = ({ faculties, shippingAddresses }: props) => {
  const [documentType, setDocumentType] = useState<'Online' | 'Paper' | null>('Paper');
  const [isSuccess, setIsSuccess] = useState(false);
  const { setFormData } = useDocumentDraftStore((state) => state);
  const router = useRouter();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof DocumentSchema>>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      documentType: 'Paper',
      shippingAddresses: [],
      stock: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof DocumentSchema>) {
    console.log(data);
    const { thumbnail, ...rest } = data;
    const newThumbnail = await fileToBase64(thumbnail);
    const galleryImages = [];
    for (const image in data.galleryImages) {
      const newImage = await fileToBase64(data.galleryImages[image]);
      galleryImages.push(newImage);
    }
    const newData = {
      ...rest,
      thumbnail: newThumbnail,
      galleryImages,
    };

    setFormData(newData);
    router.push('/documents/document-preview');

    //
    // // Create a new FormData object
    // const formDataToSend = new FormData();
    //
    // const paper =
    //   documentType === 'Paper' ? { stock: data['stock'], shippingAddresses: data['shippingAddresses'] } : {};
    //
    // // Add the JSON part
    // const documentData = {
    //   name,
    //   description,
    //   price,
    //   faculty,
    //   documentType,
    //   ...paper,
    // };
    // formDataToSend.append('document', new Blob([JSON.stringify(documentData)], { type: 'application/json' }));
    //
    // // Add the file parts
    // if (image) {
    //   formDataToSend.append('image', image);
    // }
    // if (documentType === 'Online' && data.onlineFile) {
    //   formDataToSend.append('onlineFile', data.onlineFile);
    // }
    // const res = await createDocument(formDataToSend);
    //
    // switch (res.statusCode) {
    //   case 202:
    //     form.reset();
    //     setIsSuccess(true);
    //     toast({
    //       variant: 'success',
    //       title: 'Thành công',
    //       description: 'Đã thêm tài liệu thành công',
    //     });
    //     break;
    //   default:
    //     toast({
    //       variant: 'destructive',
    //       title: 'Thông báo lỗi',
    //       description: 'Đã có lỗi xảy ra',
    //     });
    //     break;
    // }
  }
  // Dropzone component for single file (thumbnail, onlineFile)
  const DropzoneInput = ({
    onChange,
    accept,
    maxSize,
    label,
    description,
    value,
  }: {
    onChange: (file: File | undefined) => void;
    accept: Record<string, string[]>;
    maxSize: number;
    value: File;
    label: string;
    description: string;
  }) => {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          onChange(acceptedFiles[0]);
        } else {
          onChange(undefined);
        }
      },
      [onChange]
    );

    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      maxFiles: 1,
      maxSize,
    });

    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <p>{isDragActive ? 'Thả tệp vào đây...' : 'Kéo và thả tệp vào đây hoặc nhấp để chọn tệp'}</p>
          </div>
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
        {value && (
          <div className="mt-2">
            <p>
              Selected file: {value.name} ({(value.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
      </FormItem>
    );
  };

  // Dropzone component for multiple files (galleryImages)
  const MultiDropzoneInput = ({
    onChange,
    accept,
    maxSize,
    maxFiles,
    label,
    description,
    value,
  }: {
    onChange: (files: File[]) => void;
    accept: Record<string, string[]>;
    value: File[];
    maxSize: number;
    maxFiles: number;
    label: string;
    description: string;
  }) => {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        onChange(acceptedFiles);
      },
      [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      maxFiles,
      maxSize,
    });

    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <p>{isDragActive ? 'Thả các tệp vào đây...' : 'Kéo và thả các tệp vào đây hoặc nhấp để chọn tệp'}</p>
          </div>
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
        {value?.length > 0 && (
          <ul className="mt-2">
            {value.map((file, index) => (
              <li key={index} className="mb-1">
                <p>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              </li>
            ))}
          </ul>
        )}
      </FormItem>
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <DropzoneInput
              value={field.value}
              onChange={field.onChange}
              accept={{ 'image/*': [] }}
              maxSize={5000000} // 5MB
              label="Hình ảnh"
              description="Chọn hình ảnh cho tài liệu (tối đa 5MB)."
            />
          )}
        />
        <FormField
          control={form.control}
          name="galleryImages"
          render={({ field }) => (
            <MultiDropzoneInput
              value={field.value}
              onChange={field.onChange}
              accept={{ 'image/*': [] }}
              maxSize={5000000} // 5MB per file
              maxFiles={10} // Max 10 images
              label="Ảnh bộ sưu tập"
              description="Thêm nhiều ảnh hiển thị dưới ảnh chính (tối đa 10 ảnh, mỗi ảnh < 5MB)."
            />
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tài liệu</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên tài liệu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả tài liệu</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả cho tài liệu" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá tài liệu</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập giá tài liệu"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngành học</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngành học" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {faculties.map((item, index) => (
                    <SelectItem key={index} value={item.facultyID}>
                      {toTitleCase(item.facultyName)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình thức tài liệu</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setDocumentType(value as 'Online' | 'Paper');
                  }}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Paper" />
                    </FormControl>
                    <FormLabel className="font-normal">Tài liệu giấy</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Online" />
                    </FormControl>
                    <FormLabel className="font-normal">Tài liệu online</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {documentType === 'Online' && (
          <FormField
            control={form.control}
            name="onlineFile"
            render={({ field }) => (
              <DropzoneInput
                value={field.value}
                onChange={field.onChange}
                accept={{
                  'application/pdf': [],
                  'ms-word': [],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                }}
                maxSize={12000000} // 120MB
                label="Tài liệu"
                description="Chọn tài liệu (tối đa 120MB)."
              />
            )}
          />
        )}
        {documentType === 'Paper' && (
          <div>
            <FormField
              control={form.control}
              name="shippingAddresses"
              render={() => (
                <FormItem>
                  <FormLabel>Vị trí giao hàng</FormLabel>
                  {shippingAddresses.map((item) => (
                    <FormField
                      key={item.addressId}
                      control={form.control}
                      name="shippingAddresses"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.addressId} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.addressId)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.addressId])
                                    : field.onChange(field.value?.filter((value) => value !== item.addressId));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{toTitleCase(item.addressName)}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng tồn kho</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số lượng tồn kho"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <CustomSubmitButton
          isSuccess={false}
          form={form}
          successMessage="Thêm tài liệu thành công"
          defaultMessage="Thêm tài liệu"
        />
      </form>
    </Form>
  );
};

export default DocumentForm;
