'use client';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useUserStore } from '@/components/providers/UserProvider';
import dynamic from 'next/dynamic';
// import user from '@/__mocks__/data/user';

const EditAvatar = dynamic(
  () => import('@/components/(user)/(UserSetting)/MyAccount/BasicInformationComponents/EditAvatar'),
  {
    loading: () => <div>Loading...</div>,
    // ssr: false,
  }
);

const EditName = dynamic(
  () => import('@/components/(user)/(UserSetting)/MyAccount/BasicInformationComponents/EditName'),
  {
    loading: () => <div>Loading...</div>,
  }
);

const EditDOB = dynamic(
  () => import('@/components/(user)/(UserSetting)/MyAccount/BasicInformationComponents/EditDOB'),
  {
    loading: () => <div>Loading...</div>,
  }
);

const EditGender = dynamic(
  () => import('@/components/(user)/(UserSetting)/MyAccount/BasicInformationComponents/EditGender'),
  {
    loading: () => <div>Loading...</div>,
  }
);

const BasicInformation = () => {
  const { user } = useUserStore((state) => state);
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Những người khác sử dụng các dịch vụ của OUDocumentHub có thể nhìn thấy một số thông tin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* avatar section */}
          <EditAvatar avatarLink={user?.avatarLink} />
          <EditName lastName={user?.lastName} firstName={user?.firstName} />
          <EditDOB DOB={user?.dateOfBirth} />
          <EditGender gender={user?.gender} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInformation;
