import NotifyRegister from '@/components/(auth)/verify-token/NotifyRegister';
import React from 'react';
type props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const VerifyToken = ({ searchParams }: props) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <NotifyRegister verifyToken={searchParams?.register_token} />
    </div>
  );
};

export default VerifyToken;
