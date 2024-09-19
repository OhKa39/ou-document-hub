import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';
const VerifyTokenLoading = () => {
  return (
    <div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-[#0c4ca3]">OUDocumentHub</div>
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Đang xác nhận</h2>
            <div className="flex justify-center">
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            </div>
            <div className="rounded-md p-3 text-gray-600">
              <p>
                Vui lòng đợi trong khi chúng tôi xác minh mã đăng ký của bạn. Quá trình này có thể mất một vài phút.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyTokenLoading;
