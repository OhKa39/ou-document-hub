import BasicInformation from '@/components/(user)/(UserSetting)/MyAccount/BasicInformation';
import PayPalIntegration from '@/components/(user)/(UserSetting)/MyAccount/PaypalIntegration';
import SensitiveInformation from '@/components/(user)/(UserSetting)/MyAccount/SensitiveInformation';
import React from 'react';

const MyAccount = () => {
  return (
    <div className="w-full space-y-4 pb-10 lg:pb-20">
      {/* Basic Information */}
      <BasicInformation />
      <SensitiveInformation />
      <PayPalIntegration/>
    </div>
  );
};

export default MyAccount;
