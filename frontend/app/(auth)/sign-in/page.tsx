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
import { SignInSchema } from '@/schemas/SignInSchema';
import { loginAccount } from '@/actions/loginAccount';
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/components/providers/UserProvider';

type SchemaProps = z.infer<typeof SignInSchema>;

const SignIn = () => {
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
          src="/SignInVideo.webm"
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
