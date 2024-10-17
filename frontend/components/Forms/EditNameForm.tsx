import EditNameSchema from '@/schemas/EditNameSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { editUserName } from '@/actions/users';
import CustomSubmitButton from './CustomSubmitButton';
import { useUserStore } from '../providers/UserProvider';

type SchemaProps = z.infer<typeof EditNameSchema>;

type props = {
  firstName: string | undefined;
  lastName: string | undefined;
};

const EditNameForm = ({ lastName, firstName }: props) => {
  const { setUser } = useUserStore((state) => state);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<SchemaProps>({
    resolver: zodResolver(EditNameSchema),
    defaultValues: {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
    },
  });

  async function submitForm(data: SchemaProps) {
    console.log(data);
    // const dataTest = await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve(console.log('done')), 3000);
    // });
    const dataResponse = await editUserName(data);
    switch (dataResponse.statusCode) {
      case 200:
        setUser(dataResponse.data);
        setIsSuccess(true);
        break;
      default:
        setErrorMessage(dataResponse.message);
        break;
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
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
                    className={`w-full ring-1 ring-[#ece6e6] ${form.formState.errors.lastName ? 'ring-2 ring-[red]' : ''}`}
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
                    className={`w-full ring-1 ring-[#ece6e6] ${form.formState.errors.firstName ? 'ring-2 ring-[red]' : ''}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className={`mt-2 text-base ${!!errorMessage ? 'block' : 'hidden'}`}>{errorMessage}</p>
          <div className="flex w-full justify-end">
            <CustomSubmitButton
              form={form}
              isSuccess={isSuccess}
              successMessage={'Thành công'}
              defaultMessage={'Lưu thay đổi'}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditNameForm;
