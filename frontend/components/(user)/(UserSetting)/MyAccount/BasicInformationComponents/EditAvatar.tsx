'use client';
import React, { useRef, useState } from 'react';
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
import Image from 'next/image';
import { editAvatar } from '@/actions/users';
import { useUserStore } from '@/components/providers/UserProvider';

type props = {
  avatarLink: string | undefined;
};

const EditAvatar = ({ avatarLink }: props) => {
  const inputRef = useRef(null);
  const { setUser } = useUserStore((state) => state);
  const [url, setUrl] = useState<string>(avatarLink!);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 0) setUrl(URL.createObjectURL(file));
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && url !== avatarLink) {
      setUrl(avatarLink!);
    }
  };

  const handleClick = async (inputRef: any) => {
    const file = inputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await editAvatar(formData);
    console.log('API Response:', response); // Debug log

    switch (response.statusCode) {
      case 200:
        setUser(response.data);
        setUrl(response.data.avatarLink); // Update preview URL
        setIsDialogOpen(false); // Close dialog
        break;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <div className="flex h-24 w-full cursor-pointer items-center gap-4 text-sm font-medium text-[#444746] hover:bg-[#F6F6F6]">
          <div className="flex h-fit min-w-[70%] flex-col gap-4 lg:flex-row">
            <p className="w-full lg:min-w-[120px]">Ảnh đại diện</p>
            <p className="w-full lg:min-w-[420px]">Thêm ảnh hồ sơ để cá nhân hóa tài khoản của bạn</p>
          </div>
          <div className="flex w-full items-center justify-end">
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              {url && (
                <Image src={url} alt="User avatar" className="absolute left-0 top-0 object-cover" fill priority />
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ảnh đại diện</DialogTitle>
          <DialogDescription>
            Ảnh hồ sơ giúp người khác nhận ra bạn và cũng giúp bạn nhận biết được rằng mình đã đăng nhập vào tài khoản
          </DialogDescription>
        </DialogHeader>
        <label className="relative mx-auto mt-2 h-[196px] w-[196px] cursor-pointer rounded-full" htmlFor="upload">
          <input type="file" ref={inputRef} accept="image/*" className="hidden" id="upload" onChange={handleReview} />
          {url && <Image src={url} fill className="absolute" alt="User Avatar" priority />}
        </label>
        <DialogFooter>
          <Button type="button" onClick={() => handleClick(inputRef)}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAvatar;
