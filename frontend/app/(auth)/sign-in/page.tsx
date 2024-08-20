'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import ThirdAppsButton from '@/components/(auth)/ThirdAppsButton';

const formSchema: any = z.object({
  email: z.string({ required_error: 'Email không được để trống' }).email({ message: 'Email không đúng định dạng' }),
  password: z.string({ required_error: 'Mật khẩu không được để trống' }),
});

type SchemaProps = z.infer<typeof formSchema>;

const SignIn = () => {
  const form = useForm<SchemaProps>({
    resolver: zodResolver(formSchema),
  });

  function submitForm(data: SchemaProps) {
    console.log(data);
  }

  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="grid h-fit grid-rows-1 lg:grid-cols-2 lg:grid-rows-none">
      {/* image section */}
      <div>
        {/* <Image alt='SignIn thumbnail' fill src={SignInThumbnail}/> */}
        <video
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          src="/SignInVideo.mp4"
          className="h-full w-full object-cover"
          data-testid="SignInVideoSection"
        ></video>
      </div>
      {/* sign up section */}
      <div className="mx-[10%] mt-6 pb-20 lg:mx-0 lg:ml-16 lg:mt-14 lg:w-[80%]">
        <h1 className="text-3xl font-bold">Đăng Nhập</h1>
        <p className="mt-5 pb-4 text-[18px] text-[color:var(--neutral-04)]">
          Bạn chưa có tài khoản?{' '}
          <Link className="text-[color:var(--secondary-blue)]" href="/sign-up">
            Đăng ký
          </Link>
        </p>
        {/* Social Media Button */}
        <ThirdAppsButton />
        {/* Form section */}
        <div className="mt-5 w-full">
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
              <Button type="submit" className="!mt-8 w-full !text-base" aria-label="Submit Form">
                Đăng nhập
              </Button>
            </form>
          </Form>
          <p className="mt-5 text-[18px] text-[color:var(--neutral-04)]">
            Quên mật khẩu?{' '}
            <Link className="text-[color:var(--secondary-blue)]" href="#">
              Lấy lại mật khẩu
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
