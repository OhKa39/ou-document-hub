'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartProcessSchema } from '@/schemas/CartProcessSchema';
import { CART_PROCESS_OPTIONS } from '@/constants';
import useGetShippingAddresses from '@/hooks/useGetShippingAddresses';
import ShippingAddressType from '@/types/ShippingAddressType';
import toTitleCase from '@/utils/ToTitleCase';
import { useCartStore } from '../providers/CartProvider';
import ToVietnameseCurrency from '@/utils/ToVietnameseCurrency';
import { useRouter } from 'next/navigation';

const CartProcessForm = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetShippingAddresses();
  const { calcTotalPrice } = useCartStore((state) => state);
  console.log(data);
  const addresses = data?.data.content;
  const form = useForm<z.infer<typeof CartProcessSchema>>({
    resolver: zodResolver(CartProcessSchema),
    defaultValues: {
      type: addresses ? addresses[0].addressId : 'abc',
    },
  });

  function onSubmit(data: z.infer<typeof CartProcessSchema>) {
    console.log(data);
    router.replace('/cart/process-step-2');
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormControl>
              <FormItem>
                <RadioGroup className="mt-4 w-full space-y-2" onValueChange={field.onChange} defaultValue={field.value}>
                  {addresses.map((option: ShippingAddressType) => (
                    <FormItem
                      className="flex h-[52px] w-full items-center space-x-2 rounded-sm border-[1px] border-[#6c7275] px-2"
                      key={option.addressId}
                    >
                      <FormControl>
                        <RadioGroupItem value={option.addressId} id={option.addressId} />
                      </FormControl>
                      <FormLabel className="!mx-3 !my-0">{toTitleCase(option.addressName)}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            </FormControl>
          )}
        />
        <div className="flex w-full justify-between text-base">
          <p>Số tiền thanh toán gốc</p>
          <p>{ToVietnameseCurrency(calcTotalPrice())}</p>
        </div>
        <div className="flex w-full justify-between text-xl font-semibold">
          <p>Tổng cộng</p>
          <p>{ToVietnameseCurrency(calcTotalPrice())}</p>
        </div>
        <Button className="w-full" type="submit">
          Checkout
        </Button>
      </form>
    </Form>
  );
};

export default CartProcessForm;
