'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderContactSchema from '@/schemas/OrderContactSchema';
import OrderPaypal from '../(user)/Cart/OrderPaypal';
import { useUserStore } from '@/components/providers/UserProvider';
import ServerFetch from '@/utils/ServerFetch';
import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';

export default function OrderForm() {
  const { user } = useUserStore((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof OrderContactSchema>>({
    resolver: zodResolver(OrderContactSchema),
    defaultValues: {
      paymentMethod: 'money',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    },
  });

  const handleOrderCaptured = async (orderData: any) => {
    try {
      setIsSubmitting(true);
      const res = await ServerFetch(
        `${PAYMENT_ENDPOINT}/save-order?user_id=${user?.userId}&status=${orderData.status}&payment_method=DIGITAL_WALLET`,
        { method: 'POST' }
      );
      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes('sold out')) {
          setError(errorText);
        } else {
          throw new Error('Failed to save PayPal order');
        }
      } else {
        const orderDetails = await res.json();
        // Redirect to SuccessPage with order details
        router.push(`/cart/process-step-3?orderDetails=${encodeURIComponent(JSON.stringify(orderDetails))}`);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  async function onSubmit(values: z.infer<typeof OrderContactSchema>) {
    if (values.paymentMethod === 'money') {
      setIsSubmitting(true);
      try {
        const res = await ServerFetch(
          `${PAYMENT_ENDPOINT}/save-order?user_id=${user?.userId}&status=PENDING&payment_method=CASH&first_name=${values.firstName}&last_name=${values.lastName}&phone_number=${values.phoneNumber}&email=${values.email}`,
          { method: 'POST' }
        );
        if (!res.ok) {
          throw new Error('Failed to save cash order');
        }
        const orderDetails = await res.json();
        // Redirect to SuccessPage with order details
        router.push(`/cart/process-step-3?orderDetails=${encodeURIComponent(JSON.stringify(orderDetails))}`);
      } catch (error: any) {
        setError(error.message || 'Failed to save order');
      } finally {
        setIsSubmitting(false);
      }
    }
    // For PayPal, submission is handled by OrderPaypal's onApprove callback
  }

  const paymentMethod = form.watch('paymentMethod');

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardTitle>Payment method</CardTitle>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="money" />
                        </FormControl>
                        <FormLabel className="font-normal">Thanh toán bằng tiền mặt</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="online banking" />
                        </FormControl>
                        <FormLabel className="font-normal">Thanh toán trực tuyến</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === 'money' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FIRST NAME</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LAST NAME</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PHONE NUMBER</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EMAIL ADDRESS</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </>
            )}

            {paymentMethod === 'online banking' && <OrderPaypal onOrderCaptured={handleOrderCaptured} />}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
