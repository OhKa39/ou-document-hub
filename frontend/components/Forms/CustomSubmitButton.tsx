import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Button } from '../ui/button';
import { TiTick } from 'react-icons/ti';

type props = {
  form: any;
  isSuccess: boolean;
  successMessage: string;
  defaultMessage: string;
};

const CustomSubmitButton = ({ form, isSuccess, successMessage, defaultMessage }: props) => {
  return (
    <Button
      type="submit"
      className="!mt-6 w-full !text-base"
      aria-label="Submit Form"
      disabled={form.formState.isSubmitting || isSuccess}
      variant={isSuccess ? 'success' : 'default'}
    >
      {form.formState.isSubmitting && (
        <div className="flex items-center gap-2">
          <AiOutlineLoading3Quarters className="animate-spin text-white" size={20} />
          <span>Loading</span>
        </div>
      )}
      {isSuccess && (
        <div className="flex items-center gap-2 text-white">
          <TiTick size={24} />
          <span>{successMessage}</span>
        </div>
      )}
      {!isSuccess && !form.formState.isSubmitting && <span>{defaultMessage}</span>}
    </Button>
  );
};

export default CustomSubmitButton;
