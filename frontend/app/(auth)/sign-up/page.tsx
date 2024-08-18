'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

const passwordValidation = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,50}$/);

const formSchema: any = z
  .object({
    username: z
      .string()
      .min(6, {
        message: 'Tên đăng nhập phải có ít nhất 6 ký tự',
      })
      .max(50, {
        message: 'Tài khoản đăng nhập phải nhỏ hơn 50 ký tự',
      }),
    email: z.string().min(1, { message: 'Email không được để trống' }).email({ message: 'Email không đúng định dạng' }),
    password: z
      .string()
      .min(8, {
        message: 'Mật khẩu phải có ít nhất 8 ký tự',
      })
      .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,50}$/, {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự hoa, 1 kí tự đặc biệt, 1 kí tự thường và 1 kí tự chữ số',
      }),
    confirmPassword: z.string().min(1, { message: 'Xác nhận mật khẩu không được để trống' }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Mật khẩu không trùng khớp',
      path: ['confirmPassword'],
    });

type SchemaProps = z.infer<typeof formSchema>;

const SignUp = () => {
  const form = useForm<SchemaProps>({
    resolver: zodResolver(formSchema),
  });

  function submitForm() {
    console.log('submit');
  }

  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <div className="grid h-fit grid-rows-1 md:grid-cols-2 md:grid-rows-none">
      {/* image section */}
      <div>
        {/* <Image alt='SignUp thumbnail' fill src={SignUpThumbnail}/> */}
        <video
          playsInline={true}
          autoPlay={true}
          loop={true}
          muted={true}
          src="/SignUpVideo.mp4"
          className="h-full w-full object-cover"
        ></video>
      </div>
      {/* sign up section */}
      <div className="mx-auto mt-6 md:mx-0 md:ml-16 md:mt-14 pb-8">
        <h1 className="text-3xl font-bold">Đăng ký</h1>
        <p className="mt-5 text-base text-[color:var(--neutral-04)]">
          Bạn đã có tài khoản?{' '}
          <Link className="text-[color:var(--secondary-blue)]" href="/sign-in">
            Đăng nhập
          </Link>
        </p>
        {/* Form section */}
        <div className="mt-5 lg:w-[80%] w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tài khoản" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
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
                    <FormLabel htmlFor={'password'}>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id={'password'} 
                          placeholder="Nhập mật khẩu" {...field} 
                          type={`${!isShowPassword ? 'password' : 'text'}`} 
                          onCopy={(e) => e.preventDefault()}
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác Nhận Mật khẩu</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập xác nhận mật khẩu" {...field} type="password" onPaste={(e)=>e.preventDefault()}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className='w-full'>Đăng ký</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
