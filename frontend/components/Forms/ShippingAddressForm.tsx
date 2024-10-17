'use client';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomSubmitButton from './CustomSubmitButton';
import ShippingAddressSchema from '@/schemas/ShippingAddressSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { createShippingAddress, updateShippingAddress } from '@/actions/shipping_addresses';

type props = {
  shippingAddressName?: string;
  shippingAddressID?: string;
};

type SchemaProps = z.infer<typeof ShippingAddressSchema>;

const ShippingAddressForm = ({ shippingAddressName, shippingAddressID }: props) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const form = useForm<SchemaProps>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      shippingAddressName: shippingAddressName ?? '',
    },
  });

  async function submitForm(data: SchemaProps) {
    console.log(data);
    // const dataTest = await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve(console.log('done')), 3000);
    // });
    const dataResponse = !shippingAddressName
      ? await createShippingAddress(data)
      : await updateShippingAddress(shippingAddressID!, data);

    switch (dataResponse.statusCode) {
      case 201:
      case 200:
        setIsSuccess(true);
        break;
      case 1005:
        form.setError('shippingAddressName', {
          type: 'manual',
          message: 'Cơ sở bạn đang tạo đã được tạo trước đó',
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <FormField
            control={form.control}
            name="shippingAddressName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[color:black]">Cơ sở</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên cơ sở"
                    {...field}
                    className={`w-full ring-1 ring-[#ece6e6] ${form.formState.errors.shippingAddressName ? 'ring-2 ring-[red]' : ''}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <CustomSubmitButton
              isSuccess={isSuccess}
              form={form}
              successMessage={`${shippingAddressID ? 'Sửa' : 'Tạo'} cơ sở thành công`}
              defaultMessage={`${shippingAddressID ? 'Sửa' : 'Tạo'} cơ sở`}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default ShippingAddressForm;
