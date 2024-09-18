'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import VerifyTokenLoading from '@/components/Loading/VerifyTokenLoading';
import { useUserStore } from '@/components/providers/UserProvider';
import { verifyRegisterToken } from '@/actions/verifyRegisterToken';

type props = {
  verifyToken: string | string[] | undefined;
};

const handleVerifyToken = async (verifyToken: any) => {
  const dataFetch = await verifyRegisterToken(verifyToken);
  if (dataFetch.statusCode !== 200) throw new Error('Fetch data failed');

  return dataFetch;
};

const NotifyRegister = ({ verifyToken }: props) => {
  const { signIn } = useUserStore((state) => state);
  const DynamicSuccessSignUp = dynamic(() => import('@/components/(auth)/SuccessSignUp'));
  const DynamicFailSignUp = dynamic(() => import('@/components/(auth)/FailSignUp'));

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verify-token'],
    queryFn: () => handleVerifyToken(verifyToken),
    retry: false,
  });

  useEffect(() => {
    if (data) signIn(data.data);
  }, [data, signIn]);

  if (isError) return <DynamicFailSignUp />;

  return <div>{!isLoading ? <DynamicSuccessSignUp /> : <VerifyTokenLoading />}</div>;
};

export default NotifyRegister;
