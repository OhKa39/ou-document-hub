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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CiCalendar } from 'react-icons/ci';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PasswordStrengthBar from '@/components/(auth)/sign-up/PasswordStrengthBar';
import ThirdAppsButton from '@/components/(auth)/ThirdAppsButton';
import { SignUpSchema } from '@/schemas/SignUpSchema';
import { createAccount } from '@/actions/createAccount';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import EmailVerification from '@/components/(auth)/sign-up/EmailVerification';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/components/providers/UserProvider';

type SchemaProps = z.infer<typeof SignUpSchema>;

const SignUp = () => {
  const { signUp } = useUserStore((state) => state);
  const { toast } = useToast();
  const form = useForm<SchemaProps>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      gender: '',
      password: '',
      confirmPassword: '',
      email: '',
    },
  });

  async function submitForm(data: SchemaProps) {
    console.log(data);
    // const dataTest = await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve(console.log('done')), 3000);
    // });
    const dataResponse = await createAccount(data);

    switch (dataResponse.statusCode) {
      case 201:
        signUp(dataResponse.data);
        setIsSuccess(true);
        break;
      case 1001:
        form.setError('email', {
          type: 'manual',
          message: 'Email đã có người sử dụng',
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
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="grid h-fit grid-rows-1 lg:grid-cols-2 lg:grid-rows-none">
      {/* image section */}
      <div>
        {/* <Image alt='SignUp thumbnail' fill src={SignUpThumbnail}/> */}
        <video
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          src="/SignUpVideo.webm"
          className="h-full w-full object-cover"
          data-testid="SignUpVideoSection"
        ></video>
      </div>
      {/* sign up section */}
      <div className="mx-[10%] mt-6 pb-20 lg:mx-0 lg:ml-16 lg:mt-14 lg:w-[80%]">
        <h1 className="text-3xl font-bold">Đăng ký</h1>
        <p className="mt-5 text-[18px] text-[color:var(--neutral-04)]">
          Bạn đã có tài khoản?{' '}
          <Link className="text-[color:var(--secondary-blue)]" href="/sign-in">
            Đăng nhập
          </Link>
        </p>
        {/* Social Media Button */}
        <ThirdAppsButton />
        {/* Form section */}
        <div className="mt-5 w-full">
          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
                <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[color:black]">Họ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập họ"
                            {...field}
                            className={`ring-1 ring-[#ece6e6] lg:w-[230px] ${form.formState.errors.lastName ? 'ring-2 ring-[red]' : ''}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[color:black]">Tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên"
                            {...field}
                            className={`ring-1 ring-[#ece6e6] lg:w-[230px] ${form.formState.errors.firstName ? 'ring-2 ring-[red]' : ''}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                            onChangeCapture={(e) => setPassword(e.currentTarget.value)}
                            autoComplete="on"
                            className={`ring-1 ring-[#ece6e6] ${form.formState.errors.password ? 'ring-2 ring-[red]' : ''}`}
                            title="Ít nhất 8 kí tự, tồn tại chữ hoa, chữ thường, chữ số, kí tự đặc biệt"
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
                      <PasswordStrengthBar password={password} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[color:black]">Xác Nhận Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập xác nhận mật khẩu"
                          {...field}
                          type="password"
                          autoComplete="on"
                          onPaste={(e) => e.preventDefault()}
                          className={`ring-1 ring-[#ece6e6] ${form.formState.errors.confirmPassword ? 'ring-2 ring-[red]' : ''}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[color:black]">Ngày sinh</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={`pl-3 text-left text-base font-normal lg:w-[230px] ${!field.value && 'text-muted-foreground'} ${form.formState.errors.dateOfBirth ? 'ring-2 ring-[red]' : ''} `}
                                aria-label="Pick Date Of Birth"
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Chọn ngày sinh</span>}
                                <CiCalendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date: any) => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[color:black]">Giới tính</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              className={`${!field.value && 'text-muted-foreground'} ring-1 ring-[#ece6e6] lg:w-[230px] ${form.formState.errors.gender ? 'ring-2 ring-[red]' : ''}`}
                              aria-label="Pick gender"
                            >
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male" className="pointer-cursor">
                              Nam
                            </SelectItem>
                            <SelectItem value="Famale" className="pointer-cursor">
                              Nữ
                            </SelectItem>
                            <SelectItem value="Other" className="pointer-cursor">
                              Khác
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                    <span> Đăng ký </span>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <EmailVerification />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
