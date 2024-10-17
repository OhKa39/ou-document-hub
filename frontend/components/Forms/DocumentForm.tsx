'use client';
import DocumentSchema from '@/schemas/DocumentSchema';
import React, { useState } from 'react';

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

type props = {
  faculties: FacultyType[];
  shippingAddresses: ShippingAddressType[];
};

const DocumentForm = ({ faculties, shippingAddresses }: props) => {
  const [documentType, setDocumentType] = useState<'Online' | 'Paper' | null>('Paper');
  const [isSuccess, setIsSuccess] = useState(false);

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
    const { name, description, price, faculty, documentType, image } = data;

    // Create a new FormData object
    const formDataToSend = new FormData();

    const paper =
      documentType === 'Paper' ? { stock: data['stock'], shippingAddresses: data['shippingAddresses'] } : {};

    // Add the JSON part
    const documentData = {
      name,
      description,
      price,
      faculty,
      documentType,
      ...paper,
    };
    formDataToSend.append('document', new Blob([JSON.stringify(documentData)], { type: 'application/json' }));

    // Add the file parts
    if (image) {
      formDataToSend.append('image', image);
    }
    if (documentType === 'Online' && data.onlineFile) {
      formDataToSend.append('onlineFile', data.onlineFile);
    }
    const res = await createDocument(formDataToSend);

    switch (res.statusCode) {
      case 201:
        form.reset();
        setIsSuccess(true);
        toast({
          variant: 'success',
          title: 'Thành công',
          description: 'Đã thêm tài liệu thành công',
        });
        break;
      default:
        toast({
          variant: 'destructive',
          title: 'Thông báo lỗi',
          description: 'Đã có lỗi xảy ra',
        });
        break;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
              </FormControl>
              <FormDescription>Chọn hình ảnh cho tài liệu (tối đa 5MB).</FormDescription>
              <FormMessage />
            </FormItem>
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
              <FormItem>
                <FormLabel>Tệp tài liệu online</FormLabel>
                <FormControl>
                  <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                </FormControl>
                <FormMessage />
              </FormItem>
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
