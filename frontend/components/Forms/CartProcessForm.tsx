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

const CartProcessForm = () => {
  const form = useForm<z.infer<typeof CartProcessSchema>>({
    resolver: zodResolver(CartProcessSchema),
    defaultValues: {
      type: CART_PROCESS_OPTIONS[0].value,
    },
  });

  function onSubmit(data: z.infer<typeof CartProcessSchema>) {
    console.log(data);
  }

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
                  {CART_PROCESS_OPTIONS.map((option) => (
                    <FormItem
                      className="flex h-[52px] w-full items-center space-x-2 rounded-sm border-[1px] border-[#6c7275] px-2"
                      key={option.id}
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value} id={option.value} />
                      </FormControl>
                      <FormLabel className="!mx-3 !my-0">{option.name}</FormLabel>
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
          <p>123</p>
        </div>
        <div className="flex w-full justify-between text-xl font-semibold">
          <p>Tổng cộng</p>
          <p>123</p>
        </div>
        <Button className="w-full" type="submit">
          Checkout
        </Button>
      </form>
    </Form>
  );
};

export default CartProcessForm;
