import EditGenderSchema from '@/schemas/EditGenderSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GENDER } from '@/constants';
import CustomSubmitButton from './CustomSubmitButton';

type SchemaProps = z.infer<typeof EditGenderSchema>;

type props = {
  gender: string | undefined;
};

const EditGenderForm = ({ gender }: props) => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<SchemaProps>({
    resolver: zodResolver(EditGenderSchema),
    defaultValues: {
      gender: gender ?? 'Male',
    },
  });

  async function submitForm(data: SchemaProps) {
    console.log(data);
    // const dataTest = await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve(console.log('done')), 3000);
    // });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormControl>
                <FormItem>
                  <RadioGroup
                    className="mt-1 w-full space-y-2"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GENDER.map((option, index) => (
                      <FormItem key={index}>
                        <FormControl>
                          <RadioGroupItem value={option} id={option} />
                        </FormControl>
                        <FormLabel className="!mx-2">{option}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          <p className={`mt-2 text-base ${!!errorMessage ? 'block' : 'hidden'}`}>{errorMessage}</p>
          <div className="flex w-full justify-end">
            <CustomSubmitButton
              form={form}
              isSuccess={false}
              successMessage={'Thành công'}
              defaultMessage={'Lưu thay đổi'}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditGenderForm;
