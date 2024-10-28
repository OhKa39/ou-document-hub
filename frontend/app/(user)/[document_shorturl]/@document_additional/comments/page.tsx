import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import Image from 'next/image';

const page = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-semibold">Bình luận</p>
        <Textarea placeholder="Gửi bình luận của bạn ở đây..." className="h- h-[72px] w-full" />
        <Button className="ml-auto w-[120px]">Gửi bình luận</Button>
      </div>
      <div>
        <div className="mt-4 flex justify-between">
          <p className="hidden text-2xl font-semibold lg:block">11 Bình Luận</p>
          <div className="flex justify-around">
            <p>Newest</p>
            <p>Icon</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex h-fit max-h-[322px] w-full items-start gap-10 pb-6 lg:max-h-[200px]">
            <div className="relative min-h-[72px] min-w-[72px] overflow-hidden rounded-full">
              <Image className="absolute object-cover" fill src="/default-avatar-2.png" alt="User's avatar" />
            </div>
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-xl font-semibold">Sofia Harvertz</p>
                <p>star</p>
                <p className="text-[#353945]">
                  I bought it 3 weeks ago and now come back just to say “Awesome Product”. I really enjoy it. At vero
                  eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
                  atque corrupt et quas molestias excepturi sint non provident.
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <p className="font-medium text-[#23262F]">Thích</p>
                <p className="font-medium text-[#23262F]">Trả lời</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
