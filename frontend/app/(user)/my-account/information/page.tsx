import BasicInformation from '@/components/(user)/(UserSetting)/MyAccount/BasicInformation';
import SensitiveInformation from '@/components/(user)/(UserSetting)/MyAccount/SensitiveInformation';
import React from 'react';

const MyAccount = () => {
  return (
    <div className="w-full space-y-4 pb-10 lg:pb-20">
      {/* Basic Information */}
      <BasicInformation />
      <SensitiveInformation />
    </div>
  );
};

export default MyAccount;
