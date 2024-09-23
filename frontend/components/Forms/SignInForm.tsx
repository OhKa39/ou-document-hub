'use client';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/components/providers/UserProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginAccount } from '@/actions/loginAccount';
import { useRouter } from 'next/navigation';
import { SignInSchema } from '@/schemas/SignInSchema';

import { z } from 'zod';

type SchemaProps = z.infer<typeof SignInSchema>;

const SignInForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { signIn } = useUserStore((state) => state);

  const form = useForm<SchemaProps>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });

  async function submitForm(data: SchemaProps) {
    console.log(data);
    const dataResponse = await loginAccount(data);

    switch (dataResponse.statusCode) {
      case 200:
        router.replace('/');
        signIn(dataResponse.data);
        break;
      case 401:
        form.setError('password', {
          type: 'manual',
          message: 'Sai tài khoản hoặc mặt khẩu',
        });
        form.setError('email', {
          type: 'manual',
          message: '',
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

  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[color:black]">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập email"
                  autoComplete="on"
                  {...field}
                  className={`ring-1 ring-[#ece6e6] ${form.formState.errors.email ? 'ring-2 ring-[red]' : ''}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={'password'} className="text-[color:black]">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    id={'password'}
                    placeholder="Nhập mật khẩu"
                    {...field}
                    type={`${!isShowPassword ? 'password' : 'text'}`}
                    autoComplete="on"
                    onCopy={(e) => e.preventDefault()}
                    className={`ring-1 ring-[#ece6e6] ${form.formState.errors.password ? 'ring-2 ring-[red]' : ''}`}
                  />
                  {!isShowPassword ? (
                    <FaEye
                      size="28"
                      className="absolute right-[2%] top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    />
                  ) : (
                    <FaEyeSlash
                      size="28"
                      className="absolute right-[2%] top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="!mt-6 w-full !text-base"
          aria-label="Submit Form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex gap-2">
              <AiOutlineLoading3Quarters className="animate-spin text-white" size={20} />
              <span>Loading</span>
            </div>
          ) : (
            <span> Đăng nhập </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
