import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import Image from 'next/image';
import VietnameseGirl from '@/public/VietnameseGirl.jpg';
import Link from 'next/link'

const SuccessSignUp = () => {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-[#0c4ca3]">OUDocumentHub</div>
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Thành công!</h2>
            <div className="flex justify-center">
              <Image src={VietnameseGirl} alt="SuccessImage" width="200" height="200" />
            </div>
            <div className="rounded-md bg-green-100 p-3 text-green-800">
              <p>Xin chúc mừng! Bạn đã hoàn tất việc xác nhận tài khoản của mình thành công</p>
            </div>
            <Button className="w-full bg-green-500 text-white hover:bg-green-600">
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessSignUp;
