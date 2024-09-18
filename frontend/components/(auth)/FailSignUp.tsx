import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import Image from 'next/image';
import VietnameseGirlChibi from '@/public/VietnameseGirlChibi.jpg';
import Link from 'next/link';

const FailSignUp = () => {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-[#0c4ca3]">OUDocumentHub</div>
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Thất bại!</h2>
            <div className="flex justify-center">
              <Image src={VietnameseGirlChibi} alt="FailImage" width="200" height="200" />
            </div>
            <div className="rounded-md bg-red-100 p-3 text-red-800">
              <p>Đường dẫn xác nhận đăng ký đã hết hạn hoặc không tồn tại</p>
            </div>
            <Button className="w-full bg-red-500 text-white hover:bg-red-600"><Link href="/">Quay về trang chủ</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FailSignUp;
