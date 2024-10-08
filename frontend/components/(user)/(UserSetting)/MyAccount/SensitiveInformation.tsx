'use client';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useUserStore } from '@/components/providers/UserProvider';
import EditName from './BasicInformationComponents/EditName';
import EditDOB from './BasicInformationComponents/EditDOB';
import EditGender from './BasicInformationComponents/EditGender';
import EditAvatar from './BasicInformationComponents/EditAvatar';
import EditPassword from './SensitiveInformationComponents/EditPassword';
// import user from '@/__mocks__/data/user';

const SensitiveInformation = () => {
  const { user } = useUserStore((state) => state);
  return (
    <div className="mt-8 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
          <CardDescription>
            Những người khác sử dụng các dịch vụ của OUDocumentHub có thể nhìn thấy một số thông tin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 w-full cursor-pointer items-center gap-4 border-t-[1px] border-[#e2e8f0] text-sm font-medium text-[#444746] hover:bg-[#F6F6F6] lg:h-14">
            <div className="flex h-fit min-w-[70%] flex-col gap-4 lg:flex-row">
              <p className="mt-[3px] lg:min-w-[120px]">Email</p>
              <p className="text-base lg:min-w-[420px]">{user?.email}</p>
            </div>
            <div className="flex w-full items-center justify-end">
              <MdKeyboardArrowRight size={40} />
            </div>
          </div>
          <EditPassword />
        </CardContent>
      </Card>
    </div>
  );
};

export default SensitiveInformation;
