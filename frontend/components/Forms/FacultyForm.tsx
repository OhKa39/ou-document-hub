'use client';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomSubmitButton from './CustomSubmitButton';
import FacultySchema from '@/schemas/FacultySchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { createFaculty, updateFaculty } from '@/actions/faculties';

type props = {
  facultyName?: string;
  facultyID?: string;
};

type SchemaProps = z.infer<typeof FacultySchema>;

const FacultyForm = ({ facultyName, facultyID }: props) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const form = useForm<SchemaProps>({
    resolver: zodResolver(FacultySchema),
    defaultValues: {
      facultyName: facultyName ?? '',
    },
  });

  async function submitForm(data: SchemaProps) {
    console.log(data);
    // const dataTest = await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve(console.log('done')), 3000);
    // });
    const dataResponse = !facultyName ? await createFaculty(data) : await updateFaculty(facultyID!, data);

    switch (dataResponse.statusCode) {
      case 201:
      case 200:
        setIsSuccess(true);
        break;
      case 1003:
        form.setError('facultyName', {
          type: 'manual',
          message: 'Ngành bạn đang tạo đã được tạo trước đó',
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
            name="facultyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[color:black]">Ngành học</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên ngành học"
                    {...field}
                    className={`w-full ring-1 ring-[#ece6e6] ${form.formState.errors.facultyName ? 'ring-2 ring-[red]' : ''}`}
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
              successMessage={`${facultyID ? 'Sửa' : 'Tạo'} ngành học thành công`}
              defaultMessage={`${facultyID ? 'Sửa' : 'Tạo'} ngành học`}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default FacultyForm;
