import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MdKeyboardArrowRight } from 'react-icons/md';
import EditNameForm from '@/components/Forms/EditNameForm';

const EditPassword = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex h-20 w-full cursor-pointer items-center gap-4 border-t-[1px] border-[#e2e8f0] text-sm font-medium text-[#444746] hover:bg-[#F6F6F6] lg:h-14">
          <div className="flex h-fit min-w-[70%] flex-col gap-4 lg:flex-row">
            <p className="mt-[3px] lg:min-w-[120px]">Mật khẩu</p>
            <p className="text-base lg:min-w-[420px]">{Array(8).fill('*').join('')}</p>
          </div>
          <div className="flex w-full items-center justify-end">
            <MdKeyboardArrowRight size={40} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ngày sinh</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you{`&apos;`}re done.
          </DialogDescription>
        </DialogHeader>
        {/* <EditNameForm/> */}
        {/* <DialogFooter>
          <Button type="submit">Lưu thay đổi</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default EditPassword;
